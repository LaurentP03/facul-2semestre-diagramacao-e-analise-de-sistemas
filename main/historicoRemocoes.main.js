import FilmeController from '../controllers/filmeController.js';

const filmeController = new FilmeController();
let historicoCompleto = [];

function carregarHistorico() {
    historicoCompleto = filmeController.obterHistoricoRemocoes();
    exibirEstatisticas(historicoCompleto);
    renderizarHistorico(historicoCompleto);
}

function exibirEstatisticas(historico) {
    const estatisticasDiv = document.getElementById('estatisticas');
    
    if (historico.length === 0) {
        estatisticasDiv.innerHTML = '';
        return;
    }

    const totalRemovidos = historico.length;
    
    const porTipo = {};
    historico.forEach(item => {
        porTipo[item.tipoMidia] = (porTipo[item.tipoMidia] || 0) + 1;
    });

    const porMotivo = {};
    historico.forEach(item => {
        const motivo = item.motivo.toLowerCase();
        if (motivo.includes('danificado') || motivo.includes('defeito')) {
            porMotivo['Danificado/Defeito'] = (porMotivo['Danificado/Defeito'] || 0) + 1;
        } else if (motivo.includes('perda') || motivo.includes('perdido')) {
            porMotivo['Perda'] = (porMotivo['Perda'] || 0) + 1;
        } else if (motivo.includes('descarte')) {
            porMotivo['Descarte'] = (porMotivo['Descarte'] || 0) + 1;
        } else {
            porMotivo['Outros'] = (porMotivo['Outros'] || 0) + 1;
        }
    });

    const iconesPorTipo = {
        'DVD': '💿',
        'Blu-Ray': '📀',
        'VHS': '📼',
        'HD-DVD': '💽'
    };

    let html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="color: white; margin-bottom: 20px; font-size: 20px;">📊 Estatísticas de Remoções</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">🗑️</div>
                    <strong style="color: #666; font-size: 14px;">Total Removido</strong>
                    <p style="font-size: 28px; color: #667eea; margin: 10px 0 0 0; font-weight: bold;">${totalRemovidos}</p>
                </div>
    `;

    Object.keys(porTipo).forEach(tipo => {
        const icone = iconesPorTipo[tipo] || '📦';
        html += `
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="font-size: 32px; margin-bottom: 5px;">${icone}</div>
                <strong style="color: #666; font-size: 14px;">${tipo}</strong>
                <p style="font-size: 28px; color: #667eea; margin: 10px 0 0 0; font-weight: bold;">${porTipo[tipo]}</p>
            </div>
        `;
    });

    html += `
            </div>
            <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="font-size: 24px; margin-right: 10px;">📈</div>
                    <strong style="color: #333; font-size: 16px;">Motivos Principais</strong>
                </div>
    `;

    const coresPorMotivo = {
        'Danificado/Defeito': { cor: '#dc3545', icone: '💔' },  // Vermelho
        'Perda': { cor: '#fd7e14', icone: '❓' },                // Laranja
        'Descarte': { cor: '#ffc107', icone: '🗑️' },           // Amarelo
        'Outros': { cor: '#6c757d', icone: '📋' }               // Cinza
    };

    Object.keys(porMotivo).forEach(motivo => {
        const porcentagem = ((porMotivo[motivo] / totalRemovidos) * 100).toFixed(1);
        const info = coresPorMotivo[motivo] || { cor: '#667eea', icone: '📦' };
        
        html += `
            <div style="margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="color: #333; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">${info.icone}</span>
                        ${motivo}
                    </span>
                    <span style="color: ${info.cor}; font-weight: bold; font-size: 16px;">${porMotivo[motivo]} (${porcentagem}%)</span>
                </div>
                <div style="background: #f0f0f0; height: 12px; border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(90deg, ${info.cor}, ${info.cor}dd); height: 100%; width: ${porcentagem}%; border-radius: 6px; transition: width 0.5s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>
                </div>
            </div>
        `;
    });

    html += `
                </div>
            </div>
        </div>
    `;

    estatisticasDiv.innerHTML = html;
}

function renderizarHistorico(historico) {
    const listaDiv = document.getElementById('listaRemocoes');
    
    if (historico.length === 0) {
        listaDiv.innerHTML = '<p style="color: #666;">Nenhuma remoção registrada ainda.</p>';
        return;
    }

    const historicoOrdenado = [...historico].sort((a, b) => 
        new Date(b.dataRemocao) - new Date(a.dataRemocao)
    );

    listaDiv.innerHTML = historicoOrdenado.map(item => {
        const data = new Date(item.dataRemocao);
        const dataFormatada = data.toLocaleDateString() + ' às ' + data.toLocaleTimeString();

        let corBorda = '#667eea';
        let iconeMotivo = '📋';
        let motivoLabel = '';
        
        const motivoLower = item.motivo.toLowerCase();
        
        if (motivoLower.includes('danificado') || motivoLower.includes('defeito')) {
            corBorda = '#dc3545';
            iconeMotivo = '💔';
            motivoLabel = 'Danificado/Defeito';
        } else if (motivoLower.includes('perda') || motivoLower.includes('perdido')) {
            corBorda = '#fd7e14';
            iconeMotivo = '❓';
            motivoLabel = 'Perda';
        } else if (motivoLower.includes('descarte')) {
            corBorda = '#ffc107';
            iconeMotivo = '🗑️';
            motivoLabel = 'Descarte';
        } else {
            corBorda = '#6c757d';
            iconeMotivo = '📋';
            motivoLabel = 'Outros';
        }

        const iconesTipoMidia = {
            'DVD': '💿',
            'Blu-Ray': '📀',
            'VHS': '📼',
            'HD-DVD': '💽'
        };
        const iconeTipo = iconesTipoMidia[item.tipoMidia] || '📦';

        return `
            <div class="item" style="border-left: 4px solid ${corBorda};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #333;">🎬 ${item.filmeTitulo}</h4>
                    <span class="badge" style="background: ${corBorda}; color: white; padding: 5px 12px; border-radius: 12px; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                        ${iconeMotivo} ${motivoLabel}
                    </span>
                </div>
                <div style="display: grid; gap: 8px; margin-top: 12px;">
                    <p style="margin: 0; display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #666;">Código:</strong> 
                        <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${item.numeroSerie}</span>
                    </p>
                    <p style="margin: 0; display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #666;">Tipo:</strong> 
                        <span style="display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 20px;">${iconeTipo}</span>
                            ${item.tipoMidia}
                        </span>
                    </p>
                    <p style="margin: 0;"><strong style="color: #666;">📅 Data:</strong> ${dataFormatada}</p>
                    <div style="background: #f9f9f9; padding: 10px; border-radius: 5px; margin-top: 5px; border-left: 3px solid ${corBorda};">
                        <strong style="color: #666;">Motivo:</strong> 
                        <p style="margin: 5px 0 0 0; color: ${corBorda}; font-weight: 500;">${item.motivo}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.filtrarHistorico = function() {
    const tipoSelecionado = document.getElementById('filtroTipo').value;
    const termoBusca = document.getElementById('buscarFilme').value.toLowerCase();

    let historicoFiltrado = historicoCompleto;

    if (tipoSelecionado) {
        historicoFiltrado = historicoFiltrado.filter(item => item.tipoMidia === tipoSelecionado);
    }

    if (termoBusca) {
        historicoFiltrado = historicoFiltrado.filter(item => 
            item.filmeTitulo.toLowerCase().includes(termoBusca)
        );
    }

    exibirEstatisticas(historicoFiltrado);
    renderizarHistorico(historicoFiltrado);
};

carregarHistorico();