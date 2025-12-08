class ClienteView {
    static renderizarLista(clientes, containerId) {
        const container = document.getElementById(containerId);

        if (!clientes || clientes.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhum cliente cadastrado ainda.</p>';
            return;
        }

        container.innerHTML = clientes.map(c => `
            <div class="item">
                <h4>${c.nome}</h4>
                <p><strong>Email:</strong> ${c.email}</p>
                <p><strong>Data Nascimento:</strong> ${new Date(c.dataNascimento).toLocaleDateString()}</p>
                ${c.cpf ? `<p><strong>CPF:</strong> ${c.cpf}</p>` : ''}
                ${c.cpf ? '<span class="badge badge-success">Titular</span>' : '<span class="badge badge-warning">Dependente</span>'}
            </div>
        `).join('');
    }

    static renderizarSelect(clientes, selectId) {
        const select = document.getElementById(selectId);

        select.innerHTML = '<option value="">Selecione um cliente...</option>' +
            clientes.map(c => `<option value="${c.idCliente}">${c.nome}</option>`).join('');
    }

    static exibirMensagem(mensagem, tipo = 'success', containerId = 'mensagem') {
        const container = document.getElementById(containerId);
        const icone = tipo === 'success' ? '✅' : '❌';

        container.innerHTML = `<div class="alert alert-${tipo}">${icone} ${mensagem}</div>`;

        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    }

    static toggleCamposTitular(mostrar) {
        const camposTitular = document.getElementById('camposTitular');
        if (camposTitular) {
            camposTitular.style.display = mostrar ? 'block' : 'none';
        }
    }

    static limparFormulario(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }
}

export default ClienteView;