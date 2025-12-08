import StorageService from '../services/storage.js';
import { Locacao } from '../models/Locacao.js';
import FilmeController from './filmeController.js';
import ClienteController from './clienteController.js';

class LocacaoController {
    constructor() {
        this.locacoes = StorageService.getLocacoes();
        this.filmeController = new FilmeController();
        this.clienteController = new ClienteController();
    }

    listarLocacoes() {
        return this.locacoes;
    }

    listarLocacoesAtivas() {
        return this.locacoes.filter(l => !l.dataDevolucao);
    }

    listarLocacoesDevolvidas() {
        return this.locacoes.filter(l => l.dataDevolucao);
    }

    buscarLocacaoPorId(id) {
        return this.locacoes.find(l => l.idLocacao === id);
    }

    calcularValorLocacao(filme, item) {
        const valorBase = item.tipoMidia === 'Blu-Ray' ? 7.50 : 5.00;
        return filme.ehLancamento ? valorBase * 1.5 : valorBase;
    }

    calcularPrazo(filme) {
        return filme.ehLancamento ? 1 : 3;
    }

    calcularDataDevolucao(prazo) {
        const data = new Date();
        data.setDate(data.getDate() + prazo);
        return data.toISOString();
    }

    realizarLocacao(clienteId, filmeId, itemId) {
        const cliente = this.clienteController.buscarClientePorId(clienteId);
        const filme = this.filmeController.buscarFilmePorId(filmeId);
        
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        
        if (!filme) {
            throw new Error('Filme não encontrado');
        }
        
        const item = filme.itens.find(i => i.idItem === itemId);

        if (!item || item.status !== 'disponivel') {
            throw new Error('Item não está disponível');
        }

        const id = StorageService.incrementarContador();
        const valor = this.calcularValorLocacao(filme, item);
        const prazo = this.calcularPrazo(filme);
        const dataDevolucao = this.calcularDataDevolucao(prazo);

        const locacao = new Locacao(
            id, 
            {
                idItem: item.idItem,
                numeroSerie: item.numeroSerie,
                tipoMidia: item.tipoMidia,
                dataAquisicao: item.dataAquisicao,
                status: item.status
            },
            {
                idCliente: cliente.idCliente,
                nome: cliente.nome,
                email: cliente.email
            },
            {
                idFilme: filme.idFilme,
                tituloOriginal: filme.tituloOriginal,
                tituloPortugues: filme.tituloPortugues,
                ehLancamento: filme.ehLancamento
            },
            valor, 
            dataDevolucao
        );
        
        this.filmeController.atualizarStatusItem(filmeId, itemId, 'alugado');
        
        this.locacoes.push(locacao);
        StorageService.setLocacoes(this.locacoes);
        
        return locacao;
    }

    calcularMulta(dataPrevisao, dataDevolucao, valorLocacao) {
        const previsao = new Date(dataPrevisao);
        const devolucao = new Date(dataDevolucao);
        
        const diffTime = devolucao - previsao;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays > 0 ? diffDays * valorLocacao : 0;
    }

    realizarDevolucao(locacaoId) {
        const locacao = this.buscarLocacaoPorId(locacaoId);
        
        if (!locacao) {
            throw new Error('Locação não encontrada');
        }

        if (locacao.dataDevolucao) {
            throw new Error('Locação já foi devolvida');
        }
        
        if (!locacao.filme || !locacao.filme.idFilme) {
            throw new Error('Dados da locação estão corrompidos. Filme não encontrado.');
        }

        const dataDevolucao = new Date();
        const multa = this.calcularMulta(
            locacao.dataPrevistaDevolucao, 
            dataDevolucao, 
            locacao.valorCobrada
        );

        locacao.dataDevolucao = dataDevolucao.toISOString();
        locacao.multa = multa;

        this.filmeController.atualizarStatusItem(
            locacao.filme.idFilme, 
            locacao.item.idItem, 
            'disponivel'
        );

        const index = this.locacoes.findIndex(l => l.idLocacao === locacaoId);
        this.locacoes[index] = locacao;
        StorageService.setLocacoes(this.locacoes);

        return {
            locacao,
            valorTotal: locacao.valorCobrada + multa,
            multa
        };
    }

    verificarAtrasos() {
        const hoje = new Date();
        return this.listarLocacoesAtivas().map(l => {
            const dataPrevisao = new Date(l.dataPrevistaDevolucao);
            const atrasado = hoje > dataPrevisao;
            const diasAtraso = atrasado ? 
                Math.ceil((hoje - dataPrevisao) / (1000 * 60 * 60 * 24)) : 0;
            
            return {
                ...l,
                atrasado,
                diasAtraso,
                multaPrevista: diasAtraso * l.valorCobrada
            };
        });
    }
}

export default LocacaoController;