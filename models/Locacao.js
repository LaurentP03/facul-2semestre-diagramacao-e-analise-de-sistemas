export class Locacao {
    constructor(idLocacao, item, cliente, filme, valorCobrado = null, dataPrevistaDevolucao = null) {
        this.idLocacao = idLocacao;
        this.item = item;
        this.cliente = cliente;
        this.filme = filme;
        
        this.valorCobrada = valorCobrado !== null 
            ? valorCobrado 
            : filme.getValorBase(item.tipoMidia);
        
        this.dataLocacao = new Date().toISOString();
        
        if (dataPrevistaDevolucao !== null) {
            this.dataPrevistaDevolucao = dataPrevistaDevolucao;
        } else {
            const prazo = filme.getPrazoDevolucao();
            const data = new Date(Date.now() + prazo * 24 * 60 * 60 * 1000);
            this.dataPrevistaDevolucao = data.toISOString();
        }

        this.dataDevolucao = null;
        this.multa = 0;
        this.pagoNoAto = false;
    }

    registrarDevolucao() {
        this.dataDevolucao = new Date().toISOString();
    }

    aplicarMulta(valor) {
        this.multa = valor;
    }

    calcularValorFinal() {
        if (!this.dataDevolucao) return this.valorCobrada;

        const atraso = Math.ceil(
            (new Date(this.dataDevolucao) - new Date(this.dataPrevistaDevolucao)) / (1000 * 3600 * 24)
        );

        if (atraso > 0) {
            this.multa = atraso * this.valorCobrada;
        }

        return this.valorCobrada + this.multa;
    }

    temAtraso() {
        if (!this.dataDevolucao) return false;
        return new Date(this.dataDevolucao) > new Date(this.dataPrevistaDevolucao);
    }
}