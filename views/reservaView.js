class ReservaView {
    static exibirDisponibilidade(verificacao, containerId) {
        const container = document.getElementById(containerId);
        const submitBtn = document.querySelector('button[type="submit"]');

        if (!verificacao) {
            container.innerHTML = '';
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        if (verificacao.podeReservar) {
            container.innerHTML = `
                <div class="alert alert-success">
                    ✅ ${verificacao.mensagem}
                </div>
            `;
            if (submitBtn) submitBtn.disabled = false;
        } else {
            container.innerHTML = `
                <div class="alert alert-error">
                    ❌ ${verificacao.mensagem}
                </div>
            `;
            if (submitBtn) submitBtn.disabled = true;
        }
    }

    static renderizarReservasAbertas(reservas, clientes, filmes, containerId) {
        const container = document.getElementById(containerId);

        if (reservas.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhuma reserva aberta no momento.</p>';
            return;
        }

        container.innerHTML = reservas.map(r => {
            const cliente = clientes.find(c => c.idCliente === r.cliente.idCliente);
            const filme = filmes.find(f => f.idFilme === r.filme.idFilme);
            const dataReserva = new Date(r.dataHoraReserva);

            return `
                <div class="item">
                    <h4>${filme.tituloPortugues}</h4>
                    <p><strong>Cliente:</strong> ${cliente.nome}</p>
                    <p><strong>Email:</strong> ${cliente.email}</p>
                    <p><strong>Tipo de mídia:</strong> ${r.tipoMidia}</p>
                    <p><strong>Data da reserva:</strong> ${dataReserva.toLocaleString()}</p>
                    <span class="badge badge-warning">Aguardando disponibilidade</span>
                </div>
            `;
        }).join('');
    }

    static exibirMensagemSucesso(reserva, cliente, containerId = 'mensagem') {
        const container = document.getElementById(containerId);
        
        container.innerHTML = `
            <div class="alert alert-success">
                ✅ Reserva realizada com sucesso!<br>
                Você receberá um email em <strong>${cliente.email}</strong> quando o item estiver disponível.
            </div>
        `;
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    static exibirErro(mensagem, containerId = 'mensagem') {
        const container = document.getElementById(containerId);
        container.innerHTML = `<div class="alert alert-error">❌ ${mensagem}</div>`;
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    static limparFormulario(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    static limparInfo(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

export default ReservaView;