# Estrutura MVC - Vídeo Locadora Passatempo

## 📁 Organização dos Arquivos

```
projeto/
│
├── models/                  # Modelos (já existentes)
│   ├── Cliente.js
│   ├── Titular.js
│   ├── Dependente.js
│   ├── Filme.js
│   ├── Item.js
│   ├── Distribuidora.js
│   ├── Locacao.js
│   └── Reserva.js
│
├── stylesheet/
│   └── style.css          # Estilização do site
│
├── services/               # Serviços
│   └── storage.js         # Gerenciamento do localStorage
│
├── controllers/           # Controllers (lógica de negócio)
│   ├── clienteController.js
│   ├── filmeController.js
│   ├── locacaoController.js
│   └── reservaController.js
│
├── views/                 # Views (renderização)
│   ├── clienteView.js
│   ├── filmeView.js
│   ├── locacaoView.js
│   ├── devolucaoView.js
│   └── reservaView.js
│
├── main/                  # Inicializadores das páginas
│   ├── cadastroCliente.main.js
│   ├── cadastroFilme.main.js
│   ├── locacao.main.js
│   ├── devolucao.main.js
│   ├── reserva.main.js
│   ├── consulta.main.js
│   ├── adicionarItens.main.js
│   ├── removerItens.main.js
│   ├── historicoRemocoes.main.js
│   └── removerItens.main.js
│
└── pages/                 # Arquivos HTML
    ├── index.html
    ├── cadastro-cliente.html
    ├── cadastro-filme.html
    ├── locacao.html
    ├── devolucao.html
    ├── reserva.html
    ├── consulta.html
    ├── adicionar-itens.html
    ├── remover-itens.html
    ├── historico-remocoes.html
    └── consulta-clientes.html
```

## 🎯 Padrão MVC Implementado

### **Model (Modelos)**
Representam as entidades do sistema e suas regras de negócio básicas.

**Arquivos:** `Cliente.js`, `Filme.js`, `Locacao.js`, `Reserva.js`, etc.

**Responsabilidades:**
- Definir a estrutura dos dados
- Validações básicas
- Regras de negócio da entidade

### **View (Visões)**
Responsáveis pela apresentação dos dados na interface.

**Arquivos:** `clienteView.js`, `filmeView.js`, `locacaoView.js`, etc.

**Responsabilidades:**
- Renderizar listas e formulários
- Exibir mensagens ao usuário
- Atualizar a interface
- Não contêm lógica de negócio

### **Controller (Controladores)**
Gerenciam a lógica de negócio e fazem a ponte entre Model e View.

**Arquivos:** `clienteController.js`, `filmeController.js`, `locacaoController.js`, etc.

**Responsabilidades:**
- Processar requisições do usuário
- Executar lógica de negócio complexa
- Chamar Models para manipular dados
- Chamar Views para atualizar interface
- Gerenciar fluxo da aplicação

### **Service (Serviços)**
Camada auxiliar para funcionalidades transversais.

**Arquivo:** `storage.js`

**Responsabilidades:**
- Abstração do localStorage
- Operações de persistência
- Gerenciamento de IDs

### **Main (Inicializadores)**
Arquivos de entrada que conectam tudo.

**Arquivos:** `cadastroCliente.main.js`, `locacao.main.js`, etc.

**Responsabilidades:**
- Instanciar Controllers e Views
- Configurar event listeners
- Inicializar a página
- Conectar interface com lógica

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│                    USUÁRIO                          │
│         (Interage com a interface HTML)             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                    MAIN.JS                          │
│         (Event listeners e inicialização)           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                  CONTROLLER                         │
│         (Lógica de negócio e orquestração)         │
└──────┬────────────────────────────────────┬─────────┘
       │                                    │
       ▼                                    ▼
┌─────────────┐                    ┌──────────────┐
│    MODEL    │◄──────────────────►│     VIEW     │
│   (Dados)   │                    │ (Interface)  │
└──────┬──────┘                    └──────────────┘
       │
       ▼
┌─────────────┐
│   SERVICE   │
│  (Storage)  │
└─────────────┘
```