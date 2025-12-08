export class Locacao {
    constructor(idLocacao, item, cliente, valorCobrado = null, dataPrevistaDevolucao = null) {
        this.idLocacao = idLocacao;
        this.item = item;
        this.cliente = cliente;
        this.filme = item.filme; // Referência ao filme do item
        
        // Calcula valor automaticamente se não fornecido (permite override pelo atendente)
        this.valorCobrada = valorCobrado !== null 
            ? valorCobrado 
            : item.filme.getValorBase(item.tipoMidia);
        
        this.dataLocacao = new Date();
        
        // Calcula data prevista automaticamente se não fornecida (permite override pelo atendente)
        if (dataPrevistaDevolucao !== null) {
            this.dataPrevistaDevolucao = dataPrevistaDevolucao;
        } else {
            const prazo = item.filme.getPrazoDevolucao();
            this.dataPrevistaDevolucao = new Date(Date.now() + prazo * 24 * 60 * 60 * 1000);
        }

        this.dataDevolucao = null;
        this.multa = 0;
        this.pagoNoAto = false;
    }

    registrarDevolucao() {
        this.dataDevolucao = new Date();
    }

    aplicarMulta(valor) {
        this.multa = valor;
    }

    calcularValorFinal() {
        if (!this.dataDevolucao) return this.valorCobrada;

        const atraso = Math.ceil(
            (this.dataDevolucao - this.dataPrevistaDevolucao) / (1000 * 3600 * 24)
        );

        if (atraso > 0) {
            this.multa = atraso * this.valorCobrada;
        }

        return this.valorCobrada + this.multa;
    }

    temAtraso() {
        if (!this.dataDevolucao) return false;
        return this.dataDevolucao > this.dataPrevistaDevolucao;
    }
}