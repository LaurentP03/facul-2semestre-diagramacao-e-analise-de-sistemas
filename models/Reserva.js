export class Reserva {
    constructor(idReserva, cliente, filme, tipoMidia) {
        this.idReserva = idReserva;
        this.cliente = cliente;
        this.filme = filme;
        this.tipoMidia = tipoMidia;

        this.dataHoraReserva = new Date().toISOString();
        this.dataHoraLimiteRetirada = null;
        this.status = "aberta";
        this.itemReservado = null;
    }

    ativarRetirada(item) {
        this.itemReservado = item;
        const data = new Date(Date.now() + 24 * 60 * 60 * 1000);
        this.dataHoraLimiteRetirada = data.toISOString();
        item.marcarComoReservado();
    }

    expirar() {
        this.status = "expirada";
        if (this.itemReservado) {
            this.itemReservado.marcarComoDisponivel();
        }
    }

    atender() {
        this.status = "atendida";
    }

    podeReceberItem(item) {
        return item.tipoMidia === this.tipoMidia && this.status === "aberta";
    }

    estaDentroDoPrazo() {
        if (!this.dataHoraLimiteRetirada) return false;
        return new Date() <= new Date(this.dataHoraLimiteRetirada);
    }

    verificarExpiracao() {
        if (this.status === "aberta" && this.dataHoraLimiteRetirada && !this.estaDentroDoPrazo()) {
            this.expirar();
            return true;
        }
        return false;
    }
}