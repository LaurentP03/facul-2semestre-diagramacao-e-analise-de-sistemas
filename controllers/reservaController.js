import StorageService from '../services/storage.js';
import { Reserva } from '../models/Reserva.js';
import FilmeController from './filmeController.js';
import ClienteController from './clienteController.js';

class ReservaController {
    constructor() {
        this.reservas = StorageService.getReservas();
        this.filmeController = new FilmeController();
        this.clienteController = new ClienteController();
    }

    listarReservas() {
        return this.reservas;
    }

    listarReservasAbertas() {
        return this.reservas.filter(r => r.status === 'aberta');
    }

    buscarReservaPorId(id) {
        return this.reservas.find(r => r.idReserva === id);
    }

    verificarDisponibilidade(filmeId, tipoMidia) {
        const filme = this.filmeController.buscarFilmePorId(filmeId);
        
        if (!filme) {
            return { disponivel: false, mensagem: 'Filme não encontrado' };
        }

        const itensDisponiveis = filme.itens.filter(i => 
            i.tipoMidia === tipoMidia && i.status === 'disponivel'
        );

        if (itensDisponiveis.length > 0) {
            return {
                disponivel: true,
                podeReservar: false,
                quantidade: itensDisponiveis.length,
                mensagem: `Não é possível fazer reserva. Há ${itensDisponiveis.length} item(ns) disponível(is) deste tipo de mídia. Por favor, faça a locação diretamente.`
            };
        }

        return {
            disponivel: false,
            podeReservar: true,
            mensagem: 'Pode reservar! Não há itens disponíveis no momento. Você será notificado por email quando o item estiver disponível.'
        };
    }

    realizarReserva(clienteId, filmeId, tipoMidia) {
        const verificacao = this.verificarDisponibilidade(filmeId, tipoMidia);
        
        if (!verificacao.podeReservar) {
            throw new Error(verificacao.mensagem);
        }

        const cliente = this.clienteController.buscarClientePorId(clienteId);
        const filme = this.filmeController.buscarFilmePorId(filmeId);

        if (!cliente || !filme) {
            throw new Error('Cliente ou filme não encontrado');
        }

        const id = StorageService.incrementarContador();
        const reserva = new Reserva(id, cliente, filme, tipoMidia);

        this.reservas.push(reserva);
        StorageService.setReservas(this.reservas);

        return reserva;
    }

    cancelarReserva(reservaId) {
        const reserva = this.buscarReservaPorId(reservaId);
        
        if (!reserva) {
            throw new Error('Reserva não encontrada');
        }

        reserva.status = 'cancelada';
        
        const index = this.reservas.findIndex(r => r.idReserva === reservaId);
        this.reservas[index] = reserva;
        StorageService.setReservas(this.reservas);

        return reserva;
    }

    notificarDisponibilidade(filmeId, tipoMidia) {
        const reservasNotificar = this.reservas.filter(r => 
            r.status === 'aberta' && 
            r.filme.idFilme === filmeId && 
            r.tipoMidia === tipoMidia
        );

        reservasNotificar.forEach(r => {
            r.status = 'notificada';
            const index = this.reservas.findIndex(res => res.idReserva === r.idReserva);
            this.reservas[index] = r;
        });

        StorageService.setReservas(this.reservas);
        
        return reservasNotificar;
    }

    finalizarReserva(reservaId) {
        const reserva = this.buscarReservaPorId(reservaId);
        
        if (!reserva) {
            throw new Error('Reserva não encontrada');
        }

        reserva.status = 'finalizada';
        
        const index = this.reservas.findIndex(r => r.idReserva === reservaId);
        this.reservas[index] = reserva;
        StorageService.setReservas(this.reservas);

        return reserva;
    }
}

export default ReservaController;