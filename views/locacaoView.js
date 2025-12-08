// locacaoView.js - View para renderizar locações

class LocacaoView {
    static renderizarItensDisponiveis(filme, selectId) {
        const select = document.getElementById(selectId);
        
        if (!filme) {
            select.innerHTML = '<option value="">Selecione um filme primeiro</option>';
            return;
        }

        const itensDisponiveis = filme.itens.filter(i => i.status === 'disponivel');

        if (itensDisponiveis.length === 0) {
            select.innerHTML = '<option value="">Nenhum item disponível</option>';
            return;
        }

        // Agrupar itens por tipo de mídia
        const tiposDisponiveis = {};
        itensDisponiveis.forEach(item => {
            if (!tiposDisponiveis[item.tipoMidia]) {
                tiposDisponiveis[item.tipoMidia] = [];
            }
            tiposDisponiveis[item.tipoMidia].push(item);
        });

        select.innerHTML = '<option value="">Selecione...</option>' +
            Object.keys(tiposDisponiveis).map(tipoMidia => {
                const itens = tiposDisponiveis[tipoMidia];
                const primeiroItem = itens[0];
                const quantidade = itens.length;
                
                const valor = filme.ehLancamento ? 
                    (tipoMidia === 'Blu-Ray' ? 11.25 : 7.50) :
                    (tipoMidia === 'Blu-Ray' ? 7.50 : 5.00);
                
                return `<option value="${primeiroItem.idItem}">${tipoMidia} - R$ ${valor.toFixed(2)} (${quantidade} disponív${quantidade > 1 ? 'eis' : 'el'})</option>`;
            }).join('');
    }

    static exibirInfoLocacao(filme, containerId) {
        const container = document.getElementById(containerId);
        
        if (!filme) {
            container.innerHTML = '';
            return;
        }

        const itensDisponiveis = filme.itens.filter(i => i.status === 'disponivel');
        
        if (itensDisponiveis.length === 0) {
            container.innerHTML = '<div class="alert alert-error">❌ Não há itens disponíveis deste filme.</div>';
            return;
        }

        const prazo = filme.ehLancamento ? 1 : 3;
        
        // Agrupar itens por tipo para mostrar quantidades
        const tiposDisponiveis = {};
        itensDisponiveis.forEach(item => {
            if (!tiposDisponiveis[item.tipoMidia]) {
                tiposDisponiveis[item.tipoMidia] = 0;
            }
            tiposDisponiveis[item.tipoMidia]++;
        });

        const infoTipos = Object.keys(tiposDisponiveis)
            .map(tipo => `${tipo}: ${tiposDisponiveis[tipo]}`)
            .join(', ');

        container.innerHTML = `
            <div class="alert alert-success">
                <p><strong>Prazo de devolução:</strong> ${prazo} dia(s)</p>
                <p><strong>Tipo:</strong> ${filme.ehLancamento ? 'Lançamento (+50%)' : 'Catálogo'}</p>
                <p><strong>Itens disponíveis:</strong> ${infoTipos}</p>
            </div>
        `;
    }

    static renderizarLocacoesAtivas(locacoes, clientes, filmes, containerId) {
        const container = document.getElementById(containerId);

        if (locacoes.length === 0) {
            container.innerHTML = '<p style="color: #666;">Nenhuma locação ativa no momento.</p>';
            return;
        }

        container.innerHTML = locacoes.map(l => {
            // Validação: verificar se cliente e filme existem
            if (!l.cliente || !l.filme) {
                console.error('Locação com dados incompletos:', l);
                return '';
            }

            // Buscar cliente e filme pelos IDs
            const clienteId = l.cliente.idCliente;
            const filmeId = l.filme.idFilme;
            
            const cliente = clientes.find(c => c.idCliente === clienteId);
            const filme = filmes.find(f => f.idFilme === filmeId);
            
            // Se não encontrar, usar os dados salvos na locação
            const clienteNome = cliente ? cliente.nome : l.cliente.nome;
            const filmeTitulo = filme ? filme.tituloPortugues : l.filme.tituloPortugues;
            
            // Se mesmo assim não tiver dados, pular
            if (!clienteNome || !filmeTitulo) {
                console.error('Dados insuficientes para exibir locação:', l);
                return '';
            }

            const dataPrevisao = new Date(l.dataPrevistaDevolucao);
            
            return `
                <div class="item">
                    <h4>${filmeTitulo}</h4>
                    <p><strong>Cliente:</strong> ${clienteNome}</p>
                    <p><strong>Tipo:</strong> ${l.item.tipoMidia}</p>
                    <p><strong>Valor:</strong> R$ ${l.valorCobrada.toFixed(2)}</p>
                    <p><strong>Locação:</strong> ${new Date(l.dataLocacao).toLocaleDateString()}</p>
                    <p><strong>Devolução prevista:</strong> ${dataPrevisao.toLocaleDateString()}</p>
                    <span class="badge badge-warning">Em andamento</span>
                </div>
            `;
        }).filter(html => html !== '').join('');

        // Se não houver nenhuma locação válida
        if (container.innerHTML.trim() === '') {
            container.innerHTML = '<p style="color: #666;">Nenhuma locação ativa no momento.</p>';
        }
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

export default LocacaoView;