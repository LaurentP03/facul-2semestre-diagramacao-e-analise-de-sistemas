import ReservaController from '../controllers/reservaController.js';
import ReservaView from '../views/reservaView.js';
import FilmeView from '../views/filmeView.js';
import ClienteView from '../views/clienteView.js';

const reservaController = new ReservaController();

ClienteView.renderizarSelect(
    reservaController.clienteController.listarClientes(), 
    'clienteSelect'
);
FilmeView.renderizarSelect(
    reservaController.filmeController.listarFilmes(), 
    'filmeSelect'
);

function atualizarReservas() {
    ReservaView.renderizarReservasAbertas(
        reservaController.listarReservasAbertas(),
        reservaController.clienteController.listarClientes(),
        reservaController.filmeController.listarFilmes(),
        'listaReservas'
    );
}

window.verificarDisponibilidade = function() {
    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    const tipoMidia = document.getElementById('tipoMidia').value;

    if (!filmeId || !tipoMidia) {
        ReservaView.exibirDisponibilidade(null, 'infoReserva');
        return;
    }

    const verificacao = reservaController.verificarDisponibilidade(filmeId, tipoMidia);
    ReservaView.exibirDisponibilidade(verificacao, 'infoReserva');
};

document.getElementById('formReserva').addEventListener('submit', (e) => {
    e.preventDefault();

    const clienteId = parseInt(document.getElementById('clienteSelect').value);
    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    const tipoMidia = document.getElementById('tipoMidia').value;

    try {
        const reserva = reservaController.realizarReserva(clienteId, filmeId, tipoMidia);
        const cliente = reservaController.clienteController.buscarClientePorId(clienteId);
        
        ReservaView.exibirMensagemSucesso(reserva, cliente);
        ReservaView.limparFormulario('formReserva');
        ReservaView.limparInfo('infoReserva');
        atualizarReservas();
    } catch (error) {
        ReservaView.exibirErro(error.message);
    }
});

atualizarReservas();