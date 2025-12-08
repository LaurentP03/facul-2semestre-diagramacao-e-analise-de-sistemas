import LocacaoController from '../controllers/locacaoController.js';
import LocacaoView from '../views/locacaoView.js';
import FilmeView from '../views/filmeView.js';
import ClienteView from '../views/clienteView.js';

const locacaoController = new LocacaoController();

ClienteView.renderizarSelect(locacaoController.clienteController.listarClientes(), 'clienteSelect');
FilmeView.renderizarSelect(locacaoController.filmeController.listarFilmes(), 'filmeSelect');

LocacaoView.renderizarLocacoesAtivas(
    locacaoController.listarLocacoesAtivas(),
    locacaoController.clienteController.listarClientes(),
    locacaoController.filmeController.listarFilmes(),
    'locacoesAtivas'
);

window.carregarItens = function() {
    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    
    if (!filmeId) {
        LocacaoView.renderizarItensDisponiveis(null, 'itemSelect');
        LocacaoView.exibirInfoLocacao(null, 'infoLocacao');
        return;
    }

    const filme = locacaoController.filmeController.buscarFilmePorId(filmeId);
    
    if (!filme) {
        LocacaoView.renderizarItensDisponiveis(null, 'itemSelect');
        LocacaoView.exibirInfoLocacao(null, 'infoLocacao');
        return;
    }

    LocacaoView.renderizarItensDisponiveis(filme, 'itemSelect');
    LocacaoView.exibirInfoLocacao(filme, 'infoLocacao');
};

document.getElementById('formLocacao').addEventListener('submit', (e) => {
    e.preventDefault();

    const clienteId = parseInt(document.getElementById('clienteSelect').value);
    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    const itemId = parseInt(document.getElementById('itemSelect').value);

    if (!clienteId || !filmeId || !itemId) {
        LocacaoView.exibirMensagem('Por favor, preencha todos os campos!', 'error');
        return;
    }

    try {
        locacaoController.realizarLocacao(clienteId, filmeId, itemId);
        LocacaoView.exibirMensagem('Locação realizada com sucesso!');
        LocacaoView.limparFormulario('formLocacao');
        document.getElementById('infoLocacao').innerHTML = '';
        
        FilmeView.renderizarSelect(locacaoController.filmeController.listarFilmes(), 'filmeSelect');
        LocacaoView.renderizarItensDisponiveis(null, 'itemSelect');
        
        LocacaoView.renderizarLocacoesAtivas(
            locacaoController.listarLocacoesAtivas(),
            locacaoController.clienteController.listarClientes(),
            locacaoController.filmeController.listarFilmes(),
            'locacoesAtivas'
        );
    } catch (error) {
        LocacaoView.exibirMensagem(error.message, 'error');
    }
});