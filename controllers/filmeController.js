import StorageService from '../services/storage.js';
import { Filme } from '../models/Filme.js';
import { Item } from '../models/Item.js';
import { Distribuidora } from '../models/Distribuidora.js';

class FilmeController {
    constructor() {
        this.filmes = StorageService.getFilmes();
    }

    listarFilmes() {
        return this.filmes;
    }

    buscarFilmePorId(id) {
        return this.filmes.find(f => f.idFilme === id);
    }

    cadastrarFilme(dados) {
        const id = StorageService.incrementarContador();
        
        const distribuidora = new Distribuidora(
            1, 
            "Distribuidora Padrão", 
            "00.000.000/0001-00", 
            "Rua A, 123", 
            "(11) 1111-1111", 
            "João Silva"
        );

        const filme = new Filme(
            id,
            dados.tituloOriginal,
            dados.tituloPortugues,
            dados.ano,
            dados.pais,
            dados.direcao,
            dados.elenco,
            dados.sinopse,
            dados.duracao,
            dados.genero,
            dados.ehLancamento,
            distribuidora
        );

        if (dados.itens && dados.itens.length > 0) {
            this.criarItensPersonalizados(filme, dados.itens);
        } else {
            this.criarItensAutomaticos(filme);
        }

        this.filmes.push(filme);
        StorageService.setFilmes(this.filmes);
        return filme;
    }

    criarItensPersonalizados(filme, tiposItens) {
        tiposItens.forEach(tipo => {
            const id = StorageService.incrementarContador();
            let codigo;
            
            switch(tipo) {
                case 'DVD':
                    codigo = `DVD-${id}`;
                    break;
                case 'Blu-Ray':
                    codigo = `BR-${id}`;
                    break;
                case 'VHS':
                    codigo = `VHS-${id}`;
                    break;
                case 'HD-DVD':
                    codigo = `HDDVD-${id}`;
                    break;
                default:
                    codigo = `ITEM-${id}`;
            }
            
            const item = new Item(id, codigo, tipo, new Date().toISOString());
            filme.adicionarItem(item);
        });
    }

    criarItensAutomaticos(filme) {
        const tipos = ['DVD', 'DVD', 'Blu-Ray', 'Blu-Ray'];
        
        tipos.forEach(tipo => {
            const id = StorageService.incrementarContador();
            const codigo = tipo === 'DVD' ? `DVD-${id}` : `BR-${id}`;
            const item = new Item(id, codigo, tipo, new Date().toISOString());
            filme.adicionarItem(item);
        });
    }

    adicionarItensAoFilme(filmeId, tiposItens) {
        this.filmes = StorageService.getFilmes();
        
        const filme = this.buscarFilmePorId(filmeId);
        
        if (!filme) {
            throw new Error('Filme não encontrado');
        }

        if (typeof filme.adicionarItem !== 'function') {
            throw new Error('Erro interno: objeto filme corrompido. Tente recarregar a página.');
        }

        this.criarItensPersonalizados(filme, tiposItens);
        
        const index = this.filmes.findIndex(f => f.idFilme === filmeId);
        this.filmes[index] = filme;
        StorageService.setFilmes(this.filmes);
        
        return filme;
    }

    buscarFilmes(filtros) {
        return this.filmes.filter(f => {
            if (filtros.titulo && 
                !f.tituloOriginal.toLowerCase().includes(filtros.titulo.toLowerCase()) && 
                !f.tituloPortugues.toLowerCase().includes(filtros.titulo.toLowerCase())) {
                return false;
            }

            if (filtros.genero && f.genero !== filtros.genero) {
                return false;
            }

            if (filtros.tipoMidia) {
                const temMidia = f.itens.some(i => 
                    i.tipoMidia === filtros.tipoMidia && i.status === 'disponivel'
                );
                if (!temMidia) return false;
            }

            if (filtros.ator && !f.elenco.toLowerCase().includes(filtros.ator.toLowerCase())) {
                return false;
            }

            if (filtros.diretor && !f.direcao.toLowerCase().includes(filtros.diretor.toLowerCase())) {
                return false;
            }

            if (filtros.pais && !f.pais.toLowerCase().includes(filtros.pais.toLowerCase())) {
                return false;
            }

            if (filtros.apenasLancamento && !f.ehLancamento) {
                return false;
            }

            return true;
        });
    }

    atualizarFilme(id, dadosAtualizados) {
        const index = this.filmes.findIndex(f => f.idFilme === id);
        if (index !== -1) {
            this.filmes[index] = { ...this.filmes[index], ...dadosAtualizados };
            StorageService.setFilmes(this.filmes);
            return this.filmes[index];
        }
        return null;
    }

    atualizarStatusItem(filmeId, itemId, novoStatus) {
        this.filmes = StorageService.getFilmes();
        
        const filme = this.buscarFilmePorId(filmeId);
        if (filme) {
            const item = filme.itens.find(i => i.idItem === itemId);
            if (item) {
                item.status = novoStatus;
                this.atualizarFilme(filmeId, filme);
                return true;
            }
        }
        return false;
    }

    removerItem(filmeId, itemId, motivo = 'Não especificado') {
        this.filmes = StorageService.getFilmes();
        
        const filme = this.buscarFilmePorId(filmeId);
        
        if (!filme) {
            throw new Error('Filme não encontrado');
        }

        const item = filme.itens.find(i => i.idItem === itemId);
        
        if (!item) {
            throw new Error('Item não encontrado');
        }

        if (item.status !== 'disponivel') {
            throw new Error(`Item não pode ser removido. Status atual: ${item.status}`);
        }

        const remocao = {
            filmeId: filmeId,
            filmeTitulo: filme.tituloPortugues,
            itemId: itemId,
            numeroSerie: item.numeroSerie,
            tipoMidia: item.tipoMidia,
            dataRemocao: new Date().toISOString(),
            motivo: motivo
        };

        const historicoRemocoes = StorageService.get('historicoRemocoes') || [];
        historicoRemocoes.push(remocao);
        StorageService.set('historicoRemocoes', historicoRemocoes);

        filme.itens = filme.itens.filter(i => i.idItem !== itemId);

        const index = this.filmes.findIndex(f => f.idFilme === filmeId);
        this.filmes[index] = filme;
        StorageService.setFilmes(this.filmes);

        return remocao;
    }

    removerItensEmLote(filmeId, tipoMidia, quantidade, motivo = 'Não especificado') {
        this.filmes = StorageService.getFilmes();
        
        const filme = this.buscarFilmePorId(filmeId);
        
        if (!filme) {
            throw new Error('Filme não encontrado');
        }

        const itensDisponiveis = filme.itens.filter(i => 
            i.tipoMidia === tipoMidia && i.status === 'disponivel'
        );

        if (itensDisponiveis.length === 0) {
            throw new Error(`Não há itens disponíveis do tipo ${tipoMidia} para remover`);
        }

        if (quantidade > itensDisponiveis.length) {
            throw new Error(`Quantidade solicitada (${quantidade}) maior que itens disponíveis (${itensDisponiveis.length})`);
        }

        const itensRemovidos = itensDisponiveis.slice(0, quantidade);
        const idsRemovidos = itensRemovidos.map(i => i.idItem);

        const historicoRemocoes = StorageService.get('historicoRemocoes') || [];
        itensRemovidos.forEach(item => {
            historicoRemocoes.push({
                filmeId: filmeId,
                filmeTitulo: filme.tituloPortugues,
                itemId: item.idItem,
                numeroSerie: item.numeroSerie,
                tipoMidia: item.tipoMidia,
                dataRemocao: new Date().toISOString(),
                motivo: motivo
            });
        });
        StorageService.set('historicoRemocoes', historicoRemocoes);

        filme.itens = filme.itens.filter(i => !idsRemovidos.includes(i.idItem));

        const index = this.filmes.findIndex(f => f.idFilme === filmeId);
        this.filmes[index] = filme;
        StorageService.setFilmes(this.filmes);

        return {
            removidos: quantidade,
            itens: itensRemovidos.map(i => i.numeroSerie)
        };
    }

    obterHistoricoRemocoes() {
        return StorageService.get('historicoRemocoes') || [];
    }
}

export default FilmeController;