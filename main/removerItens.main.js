import FilmeController from '../controllers/filmeController.js';
import FilmeView from '../views/filmeView.js';

const filmeController = new FilmeController();

const filmes = filmeController.listarFilmes();
const filmeSelect = document.getElementById('filmeSelect');
filmeSelect.innerHTML = '<option value="">Selecione um filme...</option>' +
    filmes.map(f => `<option value="${f.idFilme}">${f.tituloPortugues} (${f.ano})</option>`).join('');

window.mostrarItensFilme = function() {
    const filmeId = parseInt(document.getElementById('filmeSelect').value);
    const itensFilmeDiv = document.getElementById('itensFilme');
    
    if (!filmeId) {
        itensFilmeDiv.innerHTML = '';
        return;
    }

    const filme = filmeController.buscarFilmePorId(filmeId);
    
    if (!filme || !filme.itens || filme.itens.length === 0) {
        itensFilmeDiv.innerHTML = `
            <div class="alert alert-error">
                ❌ Este filme não possui itens cadastrados.
            </div>
        `;
        return;
    }

    const itensDisponiveis = filme.itens.filter(i => i.status === 'disponivel');
    const itensAlugados = filme.itens.filter(i => i.status === 'alugado');
    const itensReservados = filme.itens.filter(i => i.status === 'reservado');

    let html = `
        <div class="info">
            <h3>📊 Itens do Filme: ${filme.tituloPortugues}</h3>
            <p><strong>Total de itens:</strong> ${filme.itens.length}</p>
            <p>
                <span class="badge badge-success">${itensDisponiveis.length} disponível(is)</span>
                <span class="badge badge-warning">${itensAlugados.length} alugado(s)</span>
                <span class="badge badge-danger">${itensReservados.length} reservado(s)</span>
            </p>
        </div>
    `;

    if (itensDisponiveis.length === 0) {
        html += `
            <div class="alert alert-error">
                ❌ Não há itens disponíveis para remover. Todos os itens estão alugados ou reservados.
            </div>
        `;
        itensFilmeDiv.innerHTML = html;
        return;
    }

    html += `
        <div style="margin-top: 20px;">
            <h3>🗑️ Itens Disponíveis para Remoção</h3>
            <p style="color: #666; margin-bottom: 15px;">Selecione os itens que deseja remover permanentemente do sistema:</p>
    `;

    const itensPorTipo = {};
    itensDisponiveis.forEach(item => {
        if (!itensPorTipo[item.tipoMidia]) {
            itensPorTipo[item.tipoMidia] = [];
        }
        itensPorTipo[item.tipoMidia].push(item);
    });

    Object.keys(itensPorTipo).forEach(tipo => {
        const itens = itensPorTipo[tipo];
        html += `
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea;">
                <h4 style="color: #667eea; margin-bottom: 10px;">${tipo} (${itens.length} disponível${itens.length > 1 ? 'is' : ''})</h4>
                <div style="display: grid; gap: 10px;">
        `;

        itens.forEach(item => {
            const dataAquisicao = new Date(item.dataAquisicao).toLocaleDateString();
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                    <div>
                        <strong>Código:</strong> ${item.numeroSerie}<br>
                        <small style="color: #666;">Adquirido em: ${dataAquisicao}</small>
                    </div>
                    <button onclick="confirmarRemocao(${filmeId}, ${item.idItem}, '${item.numeroSerie}', '${tipo}')" 
                            style="background: #dc3545; padding: 8px 15px;">
                        🗑️ Remover
                    </button>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';
    itensFilmeDiv.innerHTML = html;
};

window.confirmarRemocao = function(filmeId, itemId, numeroSerie, tipoMidia) {
    const confirmacao = confirm(
        `⚠️ ATENÇÃO!\n\n` +
        `Deseja realmente remover o item do sistema?\n\n` +
        `Código: ${numeroSerie}\n` +
        `Tipo: ${tipoMidia}\n\n` +
        `Esta ação NÃO pode ser desfeita!`
    );

    if (!confirmacao) return;

    const motivo = prompt(
        'Por favor, informe o motivo da remoção:\n\n' +
        'Exemplos: "Item danificado", "Mídia com defeito", "Descarte", "Perda"'
    );

    if (!motivo || motivo.trim() === '') {
        FilmeView.exibirMensagem('❌ É necessário informar o motivo da remoção.', 'error');
        return;
    }

    try {
        filmeController.removerItem(filmeId, itemId, motivo.trim());
        FilmeView.exibirMensagem(
            `✅ Item ${numeroSerie} removido com sucesso!<br>` +
            `Motivo: ${motivo.trim()}`, 
            'success'
        );
        
        mostrarItensFilme();
    } catch (error) {
        FilmeView.exibirMensagem(`❌ Erro: ${error.message}`, 'error');
    }
};

window.removerEmLote = function(filmeId, tipoMidia, quantidade) {
    const confirmacao = confirm(
        `⚠️ REMOVER EM LOTE\n\n` +
        `Deseja remover ${quantidade} item(ns) do tipo ${tipoMidia}?\n\n` +
        `Esta ação NÃO pode ser desfeita!`
    );

    if (!confirmacao) return;

    const motivo = prompt(
        'Informe o motivo da remoção em lote:\n\n' +
        'Exemplos: "Lote danificado", "Atualização de acervo", "Descarte programado"'
    );

    if (!motivo || motivo.trim() === '') {
        FilmeView.exibirMensagem('❌ É necessário informar o motivo da remoção.', 'error');
        return;
    }

    try {
        const resultado = filmeController.removerItensEmLote(filmeId, tipoMidia, quantidade, motivo.trim());
        FilmeView.exibirMensagem(
            `✅ ${resultado.removidos} item(ns) removido(s) com sucesso!<br>` +
            `Motivo: ${motivo.trim()}`, 
            'success'
        );
        
        mostrarItensFilme();
    } catch (error) {
        FilmeView.exibirMensagem(`❌ Erro: ${error.message}`, 'error');
    }
};