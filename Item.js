export class Item {
    constructor(idItem, numeroSerie, tipoMidia, dataAquisicao) {
        this.idItem = idItem;
        this.numeroSerie = numeroSerie;
        this.tipoMidia = tipoMidia;
        this.dataAquisicao = dataAquisicao;

        this.status = "disponivel"; // disponivel, reservado, alugado
        this.filme = null; // Referência ao filme (será preenchida quando adicionado ao filme)
    }

    estaDisponivel() {
        return this.status === "disponivel";
    }

    podeSerAlugado() {
        return this.status === "disponivel";
    }

    marcarComoReservado() {
        this.status = "reservado";
    }

    marcarComoAlugado() {
        this.status = "alugado";
    }

    marcarComoDisponivel() {
        this.status = "disponivel";
    }
}