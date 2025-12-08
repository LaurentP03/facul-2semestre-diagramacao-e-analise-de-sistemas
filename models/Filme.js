export class Filme {
    constructor(idFilme, tituloOriginal, tituloPortugues, ano, pais, direcao, elenco, sinopse, duracao, genero, ehLancamento, distribuidora) {
        this.idFilme = idFilme;
        this.tituloOriginal = tituloOriginal;
        this.tituloPortugues = tituloPortugues;
        this.ano = ano;
        this.pais = pais;
        this.direcao = direcao;
        this.elenco = elenco;
        this.sinopse = sinopse;
        this.duracao = duracao;
        this.genero = genero;
        this.ehLancamento = ehLancamento;
        this.distribuidora = distribuidora;

        this.itens = [];
    }

    getValorBase(tipoMidia) {
        const tabela = {
            "DVD": 5,
            "VHS": 5,
            "HD-DVD": 5,
            "Blu-Ray": 7.5
        };

        let valor = tabela[tipoMidia] || 5;

        if (this.ehLancamento) valor *= 1.5;

        return valor;
    }

    getPrazoDevolucao() {
        // Lançamentos: 1 dia, Catálogo: 3 dias
        return this.ehLancamento ? 1 : 3;
    }

    listarItensDisponiveis(tipoMidia) {
        return this.itens.filter(i => i.tipoMidia === tipoMidia && i.estaDisponivel());
    }

    adicionarItem(item) {
        this.itens.push(item);
    }
}