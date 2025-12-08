import FilmeController from '../controllers/filmeController.js';
import FilmeView from '../views/filmeView.js';

const filmeController = new FilmeController();

window.toggleQuantidade = function(tipo) {
    const checkbox = document.getElementById(`item${tipo}`);
    const qtdInput = document.getElementById(`qtd${tipo}`);
    qtdInput.disabled = !checkbox.checked;
};

FilmeView.renderizarLista(filmeController.listarFilmes(), 'listaFilmes');

document.getElementById('formFilme').addEventListener('submit', (e) => {
    e.preventDefault();

    const dados = {
        tituloOriginal: document.getElementById('tituloOriginal').value,
        tituloPortugues: document.getElementById('tituloPortugues').value,
        ano: document.getElementById('ano').value,
        pais: document.getElementById('pais').value,
        direcao: document.getElementById('direcao').value,
        genero: document.getElementById('genero').value,
        elenco: document.getElementById('elenco').value,
        sinopse: document.getElementById('sinopse').value,
        duracao: document.getElementById('duracao').value,
        ehLancamento: document.getElementById('ehLancamento').checked
    };

    const itens = [];
    
    if (document.getElementById('itemDVD').checked) {
        const qtd = parseInt(document.getElementById('qtdDVD').value);
        for (let i = 0; i < qtd; i++) {
            itens.push('DVD');
        }
    }
    
    if (document.getElementById('itemBluRay').checked) {
        const qtd = parseInt(document.getElementById('qtdBluRay').value);
        for (let i = 0; i < qtd; i++) {
            itens.push('Blu-Ray');
        }
    }
    
    if (document.getElementById('itemVHS').checked) {
        const qtd = parseInt(document.getElementById('qtdVHS').value);
        for (let i = 0; i < qtd; i++) {
            itens.push('VHS');
        }
    }
    
    if (document.getElementById('itemHDDVD').checked) {
        const qtd = parseInt(document.getElementById('qtdHDDVD').value);
        for (let i = 0; i < qtd; i++) {
            itens.push('HD-DVD');
        }
    }

    if (itens.length === 0) {
        FilmeView.exibirMensagem('Selecione pelo menos um tipo de mídia para o filme!', 'error');
        return;
    }

    dados.itens = itens;

    try {
        filmeController.cadastrarFilme(dados);
        FilmeView.exibirMensagem(`Filme cadastrado com sucesso! ${itens.length} item(ns) criado(s).`);
        FilmeView.limparFormulario('formFilme');
        
        ['DVD', 'BluRay', 'VHS', 'HDDVD'].forEach(tipo => {
            document.getElementById(`item${tipo}`).checked = false;
            document.getElementById(`qtd${tipo}`).disabled = true;
        });
        
        FilmeView.renderizarLista(filmeController.listarFilmes(), 'listaFilmes');
    } catch (error) {
        FilmeView.exibirMensagem(`Erro: ${error.message}`, 'error');
    }
});