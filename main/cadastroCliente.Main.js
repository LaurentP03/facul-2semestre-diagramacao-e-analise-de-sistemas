import ClienteController from '../controllers/clienteController.js';
import ClienteView from '../views/clienteView.js';

const clienteController = new ClienteController();

window.toggleCampos = function() {
    const tipo = document.getElementById('tipoCliente').value;
    ClienteView.toggleCamposTitular(tipo === 'titular');
};

ClienteView.renderizarLista(clienteController.listarClientes(), 'listaClientes');

document.getElementById('formCliente').addEventListener('submit', (e) => {
    e.preventDefault();

    const tipo = document.getElementById('tipoCliente').value;
    
    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        sexo: document.getElementById('sexo').value
    };

    if (tipo === 'titular') {
        dados.endereco = document.getElementById('endereco').value;
        dados.telResidencial = document.getElementById('telResidencial').value;
        dados.telCelular = document.getElementById('telCelular').value;
        dados.localTrabalho = document.getElementById('localTrabalho').value;
        dados.telComercial = document.getElementById('telComercial').value;
        dados.cpf = document.getElementById('cpf').value;
    }

    try {
        clienteController.cadastrarCliente(tipo, dados);
        ClienteView.exibirMensagem('Cliente cadastrado com sucesso!');
        ClienteView.limparFormulario('formCliente');
        ClienteView.renderizarLista(clienteController.listarClientes(), 'listaClientes');
    } catch (error) {
        ClienteView.exibirMensagem(`Erro: ${error.message}`, 'error');
    }
});