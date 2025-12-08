import FilmeController from '../controllers/filmeController.js';
import FilmeView from '../views/filmeView.js';

const filmeController = new FilmeController();

const filmes = filmeController.listarFilmes();
const filmeSelect = document.getElementById('filmeSelect');
filmeSelect.innerHTML = '<option value="">Selecione um filme...</option>' +
    filmes.map(f => `<option value="${f.idFilme}">${f.tituloPortugues} (${f.ano})</option>`).join('');

window.toggleQuantidade = function(tipo) {
    const checkbox = document.getElementById(`item${tipo}`);
    const qtdInput = document.getElementById(`qtd${tipo}`);
    qtdInput.disabled = !checkbox.checked;
};

window.mostrarItensAtuais = function() {
    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    const itensAtuaisDiv = document.getElementById('itensAtuais');
    const secaoItens = document.getElementById('secaoItens');
    
    if (!filmeId) {
        itensAtuaisDiv.innerHTML = '';
        secaoItens.style.display = 'none';
        return;
    }

    const filme = filmeController.buscarFilmePorId(filmeId);
    
    if (!filme) {
        itensAtuaisDiv.innerHTML = '';
        secaoItens.style.display = 'none';
        return;
    }

    const resumoItens = {};
    filme.itens.forEach(item => {
        if (!resumoItens[item.tipoMidia]) {
            resumoItens[item.tipoMidia] = { disponivel: 0, alugado: 0, reservado: 0, total: 0 };
        }
        resumoItens[item.tipoMidia][item.status]++;
        resumoItens[item.tipoMidia].total++;
    });

    const htmlResumo = Object.keys(resumoItens).map(tipo => {
        const dados = resumoItens[tipo];
        return `
            <div style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 4px; margin: 5px 0;">
                <strong>${tipo}:</strong>
                <span>
                    <span class="badge badge-success">${dados.disponivel} disponível</span>
                    ${dados.alugado > 0 ? `<span class="badge badge-warning">${dados.alugado} alugado</span>` : ''}
                    ${dados.reservado > 0 ? `<span class="badge badge-danger">${dados.reservado} reservado</span>` : ''}
                    <strong>Total: ${dados.total}</strong>
                </span>
            </div>
        `;
    }).join('');

    itensAtuaisDiv.innerHTML = `
        <div class="info" style="margin-top: 15px;">
            <h3>📊 Itens Atuais do Filme</h3>
            <p><strong>Filme:</strong> ${filme.tituloPortugues} (${filme.tituloOriginal})</p>
            <p><strong>Ano:</strong> ${filme.ano} | <strong>Direção:</strong> ${filme.direcao}</p>
            ${filme.ehLancamento ? '<span class="badge badge-warning">Lançamento</span>' : '<span class="badge badge-success">Catálogo</span>'}
            <div style="margin-top: 15px;">
                ${filme.itens.length > 0 ? htmlResumo : '<p style="color: #666;">Nenhum item cadastrado ainda.</p>'}
            </div>
        </div>
    `;

    secaoItens.style.display = 'block';
};

document.getElementById('formAdicionarItens').addEventListener('submit', (e) => {
    e.preventDefault();

    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    
    if (!filmeId) {
        FilmeView.exibirMensagem('Selecione um filme primeiro!', 'error');
        return;
    }

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
        FilmeView.exibirMensagem('Selecione pelo menos um tipo de mídia para adicionar!', 'error');
        return;
    }

    try {
        filmeController.adicionarItensAoFilme(filmeId, itens);
        FilmeView.exibirMensagem(`${itens.length} item(ns) adicionado(s) com sucesso!`);
        
        ['DVD', 'BluRay', 'VHS', 'HDDVD'].forEach(tipo => {
            document.getElementById(`item${tipo}`).checked = false;
            document.getElementById(`qtd${tipo}`).disabled = true;
        });
        
        mostrarItensAtuais();
    } catch (error) {
        FilmeView.exibirMensagem(`Erro: ${error.message}`, 'error');
    }
});