import LocacaoController from '../controllers/locacaoController.js';
import DevolucaoView from '../views/devolucaoView.js';

const locacaoController = new LocacaoController();

function atualizarTela() {
    const locacoesComAtraso = locacaoController.verificarAtrasos();
    DevolucaoView.renderizarLocacoesPendentes(
        locacoesComAtraso,
        locacaoController.clienteController.listarClientes(),
        locacaoController.filmeController.listarFilmes(),
        'listaDevolucoes'
    );

    const devolvidas = locacaoController.listarLocacoesDevolvidas()
        .slice(-10)
        .reverse();
    
    DevolucaoView.renderizarHistorico(
        devolvidas,
        locacaoController.clienteController.listarClientes(),
        locacaoController.filmeController.listarFilmes(),
        'historicoDevolvidos'
    );
}

window.realizarDevolucao = function(locacaoId) {
    try {
        const resultado = locacaoController.realizarDevolucao(locacaoId);
        DevolucaoView.exibirMensagemDevolucao(resultado);
        atualizarTela();
    } catch (error) {
        DevolucaoView.exibirErro(error.message);
    }
};

atualizarTela();