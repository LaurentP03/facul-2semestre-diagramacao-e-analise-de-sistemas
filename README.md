# 🎬 Vídeo Locadora Passatempo - Sistema de Gerenciamento

Trabalho de Diagramação e Análise de Sistemas - Projeto desenvolvido para gerenciar as operações de uma vídeo locadora.

## 📁 Estrutura do Projeto

```
projeto-locadora/
├── index.html                  # Página inicial
├── cadastro-filme.html         # Cadastro de filmes
├── cadastro-cliente.html       # Cadastro de clientes
├── locacao.html               # Realizar locações
├── devolucao.html             # Devolver itens
├── reserva.html               # Fazer reservas
├── consulta.html              # Consultar acervo
├── style.css                  # Estilos (único para todas páginas)
│
├── Cliente.js                 # Classe Cliente
├── Titular.js                 # Classe Titular (herda de Cliente)
├── Dependente.js              # Classe Dependente (herda de Cliente)
├── Filme.js                   # Classe Filme
├── Item.js                    # Classe Item
├── Distribuidora.js           # Classe Distribuidora
├── Locacao.js                 # Classe Locação
├── Reserva.js                 # Classe Reserva
└── SistemaLocacao.js          # Classe Sistema (opcional)
```

## 🚀 Como Executar

1. Instale a extensão **Live Server** no VS Code
2. Clique com botão direito no arquivo `index.html`
3. Selecione **"Open with Live Server"**
4. O sistema abrirá automaticamente no navegador

## 💾 Armazenamento de Dados

O sistema usa **localStorage** do navegador para salvar todos os dados:
- Filmes cadastrados
- Clientes (titulares e dependentes)  
- Locações ativas e históricas
- Reservas abertas

**Os dados ficam salvos no navegador**, então não se perdem ao fechar a página!

## 📋 Funcionalidades Implementadas

### ✅ Cadastro de Filmes
- Título original e em português
- Ano, país, direção, elenco
- Gênero, duração, sinopse
- Marcação de lançamento (valor +50%)
- **Cria automaticamente 2 DVDs e 2 Blu-Rays** para cada filme

### ✅ Cadastro de Clientes
- **Titular:** Requer idade +18, CPF, endereço completo
- **Dependente:** Apenas dados básicos
- Validação automática de maioridade

### ✅ Locação
- Seleção de cliente e filme
- Exibição de itens disponíveis com valores
- Cálculo automático de prazo (1 dia lançamento, 3 dias catálogo)
- **Valores:** DVD/VHS/HD-DVD = R$ 5,00 | Blu-Ray = R$ 7,50
- **Lançamentos:** +50% no valor

### ✅ Devolução
- Lista de locações pendentes
- Cálculo automático de multa por atraso
- Multa = dias de atraso × valor da locação
- Histórico de devoluções recentes

### ✅ Reserva
- Só permite reservar se **NÃO houver itens disponíveis**
- Notificação por email quando disponível
- Controle de reservas por ordem de chegada

### ✅ Consulta ao Acervo
- Busca por título (original ou português)
- Filtro por gênero
- Filtro por tipo de mídia disponível
- Busca por ator, diretor ou país
- Filtro para lançamentos

## 🎨 Design

- Interface moderna com gradiente roxo
- Layout responsivo (funciona em mobile)
- Navegação simples entre páginas
- Alertas visuais de sucesso/erro
- Cards organizados para listagens

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e layout responsivo
- **JavaScript ES6+** - Lógica e orientação a objetos
- **LocalStorage** - Persistência de dados
- **Módulos ES6** - Importação das classes

## 📖 Regras de Negócio Implementadas

1. ✅ Apenas maiores de 18 anos podem ser titulares
2. ✅ Titular pode ter até 3 dependentes
3. ✅ Lançamentos têm valor 50% maior
4. ✅ Prazo: 1 dia (lançamento) ou 3 dias (catálogo)
5. ✅ Multa por atraso = dias × valor locação
6. ✅ Não pode reservar se há itens disponíveis
7. ✅ Reservas por ordem de chegada
8. ✅ 24 horas para retirar item reservado

## 🎓 Sobre o Trabalho

Este projeto foi desenvolvido como trabalho acadêmico do **primeiro ano** da faculdade de Análise de Sistemas. 

O objetivo é aplicar conceitos de:
- Programação Orientada a Objetos
- Herança e polimorfismo
- Modelagem de sistemas
- Desenvolvimento web básico
- Análise de requisitos

## 👥 Grupo

Trabalho desenvolvido por [ADICIONE OS NOMES AQUI]

---

**Dúvidas?** Consulte o documento de requisitos original ou entre em contato com o professor responsável.

🎬 **Bom uso do sistema!**