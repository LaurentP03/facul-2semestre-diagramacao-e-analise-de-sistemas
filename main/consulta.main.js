import FilmeController from '../controllers/filmeController.js';
import FilmeView from '../views/filmeView.js';

const filmeController = new FilmeController();

window.buscarFilmes = function() {
    const filtros = {
        titulo: document.getElementById('buscaTitulo').value,
        genero: document.getElementById('filtroGenero').value,
        tipoMidia: document.getElementById('filtroMidia').value,
        ator: document.getElementById('buscaAtor').value,
        diretor: document.getElementById('buscaDiretor').value,
        pais: document.getElementById('buscaPais').value,
        apenasLancamento: document.getElementById('filtroLancamento').checked
    };

    const resultados = filmeController.buscarFilmes(filtros);
    FilmeView.renderizarResultadosBusca(resultados, 'resultados');
};

window.limparFiltros = function() {
    document.getElementById('buscaTitulo').value = '';
    document.getElementById('filtroGenero').value = '';
    document.getElementById('filtroMidia').value = '';
    document.getElementById('buscaAtor').value = '';
    document.getElementById('buscaDiretor').value = '';
    document.getElementById('buscaPais').value = '';
    document.getElementById('filtroLancamento').checked = false;
    document.getElementById('resultados').innerHTML = 
        '<p style="color: #666;">Use os filtros acima para buscar filmes no acervo.</p>';
};

const todosFilmes = filmeController.listarFilmes();
if (todosFilmes.length > 0) {
    FilmeView.renderizarResultadosBusca(todosFilmes, 'resultados');
} else {
    document.getElementById('resultados').innerHTML = 
        '<p style="color: #666;">Nenhum filme cadastrado ainda. <a href="cadastro-filme.html">Cadastre o primeiro filme!</a></p>';
}