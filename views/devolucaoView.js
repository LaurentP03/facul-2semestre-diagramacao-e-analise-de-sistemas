class DevolucaoView {
    static renderizarLocacoesPendentes(locacoes, clientes, filmes, containerId) {
        const container = document.getElementById(containerId);

        if (locacoes.length === 0) {
            container.innerHTML = '<p style="color: #666;">Não há locações pendentes de devolução.</p>';
            return;
        }

        container.innerHTML = locacoes.map(l => {
            const clienteId = l.cliente.idCliente;
            const filmeId = l.filme.idFilme;

            const cliente = clientes.find(c => c.idCliente === clienteId);
            const filme = filmes.find(f => f.idFilme === filmeId);

            const clienteNome = cliente ? cliente.nome : l.cliente.nome;
            const clienteEmail = cliente ? cliente.email : l.cliente.email;
            const filmeTitulo = filme ? filme.tituloPortugues : l.filme.tituloPortugues;

            if (!clienteNome || !filmeTitulo) {
                return '';
            }

            return `
                <div class="item">
                    <h4>${filmeTitulo}</h4>
                    <p><strong>Cliente:</strong> ${clienteNome}</p>
                    <p><strong>Email:</strong> ${clienteEmail}</p>
                    <p><strong>Tipo:</strong> ${l.item.tipoMidia}</p>
                    <p><strong>Valor locação:</strong> R$ ${l.valorCobrada.toFixed(2)}</p>
                    <p><strong>Data locação:</strong> ${new Date(l.dataLocacao).toLocaleDateString()}</p>
                    <p><strong>Devolução prevista:</strong> ${new Date(l.dataPrevistaDevolucao).toLocaleDateString()}</p>
                    ${l.atrasado ? `
                        <p style="color: red;"><strong>ATRASADO!</strong> ${l.diasAtraso} dia(s)</p>
                        <p style="color: red;"><strong>Multa:</strong> R$ ${l.multaPrevista.toFixed(2)}</p>
                        <span class="badge badge-danger">Em atraso</span>
                    ` : '<span class="badge badge-success">No prazo</span>'}
                    <br><br>
                    <button onclick="realizarDevolucao(${l.idLocacao})">Devolver Item</button>
                </div>
            `;
        }).filter(html => html !== '').join('');

        if (container.innerHTML.trim() === '') {
            container.innerHTML = '<p style="color: #666;">Não há locações pendentes de devolução.</p>';
        }
    }

    static renderizarHistorico(locacoes, clientes, filmes, containerId) {
        const container = document.getElementById(containerId);

        if (locacoes.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhuma devolução registrada ainda.</p>';
            return;
        }

        container.innerHTML = locacoes.map(l => {
            const clienteId = l.cliente.idCliente;
            const filmeId = l.filme.idFilme;

            const cliente = clientes.find(c => c.idCliente === clienteId);
            const filme = filmes.find(f => f.idFilme === filmeId);

            const clienteNome = cliente ? cliente.nome : l.cliente.nome;
            const filmeTitulo = filme ? filme.tituloPortugues : l.filme.tituloPortugues;

            if (!clienteNome || !filmeTitulo) {
                return '';
            }

            const valorTotal = l.valorCobrada + (l.multa || 0);

            return `
                <div class="item">
                    <h4>${filmeTitulo}</h4>
                    <p><strong>Cliente:</strong> ${clienteNome}</p>
                    <p><strong>Devolução:</strong> ${new Date(l.dataDevolucao).toLocaleDateString()}</p>
                    <p><strong>Valor:</strong> R$ ${l.valorCobrada.toFixed(2)}</p>
                    ${l.multa > 0 ? `<p style="color: red;"><strong>Multa:</strong> R$ ${l.multa.toFixed(2)}</p>` : ''}
                    <p><strong>Total:</strong> R$ ${valorTotal.toFixed(2)}</p>
                    <span class="badge badge-success">Devolvido</span>
                </div>
            `;
        }).filter(html => html !== '').join('');

        if (container.innerHTML.trim() === '') {
            container.innerHTML = '<p style="color: #666;">Nenhuma devolução registrada ainda.</p>';
        }
    }

    static exibirMensagemDevolucao(resultado, containerId = 'mensagem') {
        const container = document.getElementById(containerId);

        let mensagem = `✅ Devolução realizada com sucesso!<br>Valor total: R$ ${resultado.valorTotal.toFixed(2)}`;

        if (resultado.multa > 0) {
            mensagem += `<br><span style="color: red;">Multa por atraso: R$ ${resultado.multa.toFixed(2)}</span>`;
        }

        container.innerHTML = `<div class="alert alert-success">${mensagem}</div>`;

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
}

export default DevolucaoView;