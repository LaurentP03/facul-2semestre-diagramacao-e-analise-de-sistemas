class FilmeView {
    static renderizarLista(filmes, containerId) {
        const container = document.getElementById(containerId);

        if (!filmes || filmes.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhum filme cadastrado ainda.</p>';
            return;
        }

        container.innerHTML = filmes.map(f => `
            <div class="item">
                <h4>${f.tituloPortugues} (${f.ano})</h4>
                <p><strong>Original:</strong> ${f.tituloOriginal}</p>
                <p><strong>Direção:</strong> ${f.direcao} | <strong>Gênero:</strong> ${f.genero}</p>
                <p><strong>Duração:</strong> ${f.duracao} min | <strong>País:</strong> ${f.pais}</p>
                ${f.ehLancamento ? '<span class="badge badge-warning">Lançamento</span>' : '<span class="badge badge-success">Catálogo</span>'}
            </div>
        `).join('');
    }

    static renderizarSelect(filmes, selectId) {
        const select = document.getElementById(selectId);

        select.innerHTML = '<option value="">Selecione um filme...</option>' +
            filmes.map(f => `<option value="${f.idFilme}">${f.tituloPortugues}</option>`).join('');
    }

    static renderizarResultadosBusca(filmes, containerId) {
        const container = document.getElementById(containerId);

        if (filmes.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhum filme encontrado com os critérios informados.</p>';
            return;
        }

        container.innerHTML = filmes.map(f => {
            const itensDisponiveis = f.itens.filter(i => i.status === 'disponivel');
            const tiposDisponiveis = [...new Set(itensDisponiveis.map(i => i.tipoMidia))];

            return `
                <div class="item">
                    <h4>${f.tituloPortugues} (${f.ano})</h4>
                    <p><strong>Título Original:</strong> ${f.tituloOriginal}</p>
                    <p><strong>Direção:</strong> ${f.direcao}</p>
                    <p><strong>Elenco:</strong> ${f.elenco}</p>
                    <p><strong>Gênero:</strong> ${f.genero} | <strong>País:</strong> ${f.pais}</p>
                    <p><strong>Duração:</strong> ${f.duracao} minutos</p>
                    <p><strong>Sinopse:</strong> ${f.sinopse}</p>
                    <p><strong>Mídias disponíveis:</strong> ${tiposDisponiveis.length > 0 ? tiposDisponiveis.join(', ') : 'Nenhuma'}</p>
                    ${f.ehLancamento ? '<span class="badge badge-warning">Lançamento</span>' : '<span class="badge badge-success">Catálogo</span>'}
                    ${itensDisponiveis.length > 0 ?
                    `<span class="badge badge-success">${itensDisponiveis.length} disponível(is)</span>` :
                    '<span class="badge badge-danger">Indisponível</span>'
                }
                </div>
            `;
        }).join('');
    }

    static exibirMensagem(mensagem, tipo = 'success', containerId = 'mensagem') {
        const container = document.getElementById(containerId);
        const icone = tipo === 'success' ? '✅' : '❌';

        container.innerHTML = `<div class="alert alert-${tipo}">${icone} ${mensagem}</div>`;

        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    }

    static limparFormulario(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }
}

export default FilmeView;