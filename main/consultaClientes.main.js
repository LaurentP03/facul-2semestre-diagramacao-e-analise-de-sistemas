import ClienteController from '../controllers/clienteController.js';
import LocacaoController from '../controllers/locacaoController.js';

const clienteController = new ClienteController();
const locacaoController = new LocacaoController();

let clientesCompleto = [];
let locacoes = [];

function carregarDados() {
    clientesCompleto = clienteController.listarClientes();
    locacoes = locacaoController.listarLocacoes();
    filtrarClientes();
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
}

function obterHistoricoCliente(clienteId) {
    const locacoesCliente = locacoes.filter(l => l.cliente.idCliente === clienteId);
    const ativas = locacoesCliente.filter(l => !l.dataDevolucao).length;
    const devolvidas = locacoesCliente.filter(l => l.dataDevolucao).length;
    const atrasadas = locacoesCliente.filter(l => l.dataDevolucao && l.multa > 0).length;
    
    return {
        total: locacoesCliente.length,
        ativas,
        devolvidas,
        atrasadas
    };
}

function exibirEstatisticas(clientes) {
    const estatisticasDiv = document.getElementById('estatisticas');
    
    if (clientes.length === 0) {
        estatisticasDiv.innerHTML = '';
        return;
    }

    const titulares = clientes.filter(c => c.cpf);
    const dependentes = clientes.filter(c => !c.cpf);
    const masculinos = clientes.filter(c => c.sexo === 'M');
    const femininos = clientes.filter(c => c.sexo === 'F');
    const maiores = clientes.filter(c => calcularIdade(c.dataNascimento) >= 18);
    const menores = clientes.filter(c => calcularIdade(c.dataNascimento) < 18);

    const html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <h3 style="color: white; margin-bottom: 20px; font-size: 20px;">📊 Estatísticas dos Clientes</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px;">
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">👥</div>
                    <strong style="color: #666; font-size: 14px;">Total</strong>
                    <p style="font-size: 28px; color: #667eea; margin: 10px 0 0 0; font-weight: bold;">${clientes.length}</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">👤</div>
                    <strong style="color: #666; font-size: 14px;">Titulares</strong>
                    <p style="font-size: 28px; color: #28a745; margin: 10px 0 0 0; font-weight: bold;">${titulares.length}</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">👶</div>
                    <strong style="color: #666; font-size: 14px;">Dependentes</strong>
                    <p style="font-size: 28px; color: #ffc107; margin: 10px 0 0 0; font-weight: bold;">${dependentes.length}</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">♂️</div>
                    <strong style="color: #666; font-size: 14px;">Masculino</strong>
                    <p style="font-size: 28px; color: #2196f3; margin: 10px 0 0 0; font-weight: bold;">${masculinos.length}</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">♀️</div>
                    <strong style="color: #666; font-size: 14px;">Feminino</strong>
                    <p style="font-size: 28px; color: #e91e63; margin: 10px 0 0 0; font-weight: bold;">${femininos.length}</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 32px; margin-bottom: 5px;">🎂</div>
                    <strong style="color: #666; font-size: 14px;">Maiores 18</strong>
                    <p style="font-size: 28px; color: #667eea; margin: 10px 0 0 0; font-weight: bold;">${maiores.length}</p>
                </div>
            </div>
        </div>
    `;

    estatisticasDiv.innerHTML = html;
}

function renderizarClientes(clientes) {
    const listaDiv = document.getElementById('listaClientes');
    const totalSpan = document.getElementById('totalClientes');
    
    totalSpan.textContent = clientes.length;

    if (clientes.length === 0) {
        listaDiv.innerHTML = '<p style="color: #666;">Nenhum cliente encontrado com os filtros aplicados.</p>';
        return;
    }

    listaDiv.innerHTML = clientes.map(cliente => {
        const isTitular = !!cliente.cpf;
        const idade = calcularIdade(cliente.dataNascimento);
        const historico = obterHistoricoCliente(cliente.idCliente);
        const dataNasc = new Date(cliente.dataNascimento).toLocaleDateString();

        let html = `
            <div class="item" style="border-left: 4px solid ${isTitular ? '#28a745' : '#ffc107'};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0 0 5px 0; color: #333; font-size: 20px;">${cliente.nome}</h4>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span class="badge" style="background: ${isTitular ? '#28a745' : '#ffc107'}; color: ${isTitular ? 'white' : 'black'};">
                                ${isTitular ? '👤 Titular' : '👶 Dependente'}
                            </span>
                            <span class="badge" style="background: ${cliente.sexo === 'M' ? '#2196f3' : '#e91e63'}; color: white;">
                                ${cliente.sexo === 'M' ? '♂️ Masculino' : '♀️ Feminino'}
                            </span>
                            <span class="badge" style="background: ${idade >= 18 ? '#667eea' : '#fd7e14'}; color: white;">
                                🎂 ${idade} anos
                            </span>
                        </div>
                    </div>
                    ${historico.total > 0 ? `
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #666;">Locações</div>
                            <div style="font-size: 24px; font-weight: bold; color: #667eea;">${historico.total}</div>
                        </div>
                    ` : ''}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
                    <!-- Dados Pessoais -->
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                        <h5 style="margin: 0 0 10px 0; color: #667eea; font-size: 14px;">📋 Dados Pessoais</h5>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${cliente.email}</p>
                        <p style="margin: 5px 0;"><strong>Nascimento:</strong> ${dataNasc}</p>
                        ${isTitular ? `
                            <p style="margin: 5px 0;"><strong>CPF:</strong> ${cliente.cpf || 'Não informado'}</p>
                        ` : ''}
                    </div>

                    ${isTitular ? `
                        <!-- Dados de Contato -->
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                            <h5 style="margin: 0 0 10px 0; color: #667eea; font-size: 14px;">📞 Contato</h5>
                            ${cliente.telCelular ? `<p style="margin: 5px 0;"><strong>Celular:</strong> ${cliente.telCelular}</p>` : ''}
                            ${cliente.telResidencial ? `<p style="margin: 5px 0;"><strong>Residencial:</strong> ${cliente.telResidencial}</p>` : ''}
                            ${cliente.telComercial ? `<p style="margin: 5px 0;"><strong>Comercial:</strong> ${cliente.telComercial}</p>` : ''}
                            ${cliente.endereco ? `<p style="margin: 5px 0;"><strong>Endereço:</strong> ${cliente.endereco}</p>` : ''}
                        </div>

                        ${cliente.localTrabalho ? `
                            <!-- Dados Profissionais -->
                            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                                <h5 style="margin: 0 0 10px 0; color: #667eea; font-size: 14px;">💼 Profissional</h5>
                                <p style="margin: 5px 0;"><strong>Local de Trabalho:</strong> ${cliente.localTrabalho}</p>
                            </div>
                        ` : ''}

                        ${cliente.dependentes && cliente.dependentes.length > 0 ? `
                            <!-- Dependentes -->
                            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 3px solid #ffc107;">
                                <h5 style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">👨‍👩‍👧‍👦 Dependentes (${cliente.dependentes.length})</h5>
                                ${cliente.dependentes.map(dep => `
                                    <p style="margin: 5px 0; color: #856404;">• ${dep.nome}</p>
                                `).join('')}
                            </div>
                        ` : ''}
                    ` : ''}

                    ${historico.total > 0 ? `
                        <!-- Histórico de Locações -->
                        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 3px solid #2196f3;">
                            <h5 style="margin: 0 0 10px 0; color: #1565c0; font-size: 14px;">📊 Histórico</h5>
                            <p style="margin: 5px 0;"><strong>Locações Ativas:</strong> <span style="color: #ffc107; font-weight: bold;">${historico.ativas}</span></p>
                            <p style="margin: 5px 0;"><strong>Devoluções:</strong> <span style="color: #28a745; font-weight: bold;">${historico.devolvidas}</span></p>
                            ${historico.atrasadas > 0 ? `
                                <p style="margin: 5px 0;"><strong>Com Atraso:</strong> <span style="color: #dc3545; font-weight: bold;">${historico.atrasadas}</span></p>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        return html;
    }).join('');
}

window.filtrarClientes = function() {
    const textoFiltro = document.getElementById('buscarTexto').value.toLowerCase();
    const tipoFiltro = document.getElementById('filtroTipo').value;
    const sexoFiltro = document.getElementById('filtroSexo').value;
    const maiorIdadeFiltro = document.getElementById('filtroMaiorIdade').checked;
    const ordenacao = document.getElementById('ordenacao').value;

    let clientesFiltrados = [...clientesCompleto];

    if (textoFiltro) {
        clientesFiltrados = clientesFiltrados.filter(c => 
            c.nome.toLowerCase().includes(textoFiltro) ||
            c.email.toLowerCase().includes(textoFiltro)
        );
    }

    if (tipoFiltro === 'titular') {
        clientesFiltrados = clientesFiltrados.filter(c => c.cpf);
    } else if (tipoFiltro === 'dependente') {
        clientesFiltrados = clientesFiltrados.filter(c => !c.cpf);
    }

    if (sexoFiltro) {
        clientesFiltrados = clientesFiltrados.filter(c => c.sexo === sexoFiltro);
    }

    if (maiorIdadeFiltro) {
        clientesFiltrados = clientesFiltrados.filter(c => calcularIdade(c.dataNascimento) >= 18);
    }

    switch(ordenacao) {
        case 'nome':
            clientesFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case 'email':
            clientesFiltrados.sort((a, b) => a.email.localeCompare(b.email));
            break;
        case 'dataNascimento':
            clientesFiltrados.sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));
            break;
        case 'recente':
            clientesFiltrados.sort((a, b) => b.idCliente - a.idCliente);
            break;
    }

    exibirEstatisticas(clientesFiltrados);
    renderizarClientes(clientesFiltrados);
};

window.limparFiltros = function() {
    document.getElementById('buscarTexto').value = '';
    document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroSexo').value = '';
    document.getElementById('filtroMaiorIdade').checked = false;
    document.getElementById('ordenacao').value = 'nome';
    filtrarClientes();
};

carregarDados();