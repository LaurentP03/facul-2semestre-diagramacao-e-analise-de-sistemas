Trabalho de Diagramação e Análise de Sistemas

Projeto: Vídeo Locadora Passatempo

1. Introdução
Este documento apresenta os requisitos de usuário para a informatização da Vídeo Locadora.

Assuma que essa atividade foi conduzida por meio da realização de entrevistas com cliente e usuários.

O trabalho deverá ser realizado em grupo, de até 4 pessoas.

2. Descrição do Propósito do Sistema
A vídeo-locadora necessita de um sistema de informação para apoiar a realização de suas atividades principais, a saber: empréstimo e devolução de itens e reserva de filmes. Para que essas atividades sejam apoiadas, é necessário controlar as informações acerca de filmes e clientes, dentre outros.

Além disso, devem ser fornecidas facilidades de consulta ao acervo da locadora, permitindo consultas por diversas informações dos filmes.

3. Descrição do Minimundo

A Vídeo Locadora Passatempo deseja um sistema de informação para gerenciar o atendimento aos seus clientes. O negócio principal da locadora é a locação de vídeos (ou filmes). De um dado filme, a locadora pode possuir vários itens, em diferentes mídias, tais como DVD, VHS, Blu-Ray, HD-DVD.

Os filmes são classificados nos seguintes gêneros: ação, animação, aventura, comédia, documentário, drama, ficção, guerra, musical, policial, romance, suspense e terror.

Além disso, a locadora faz distinção entre filmes de catálogo e lançamentos. Os valores padrão das locações são dados pelo tipo de mídia do item sendo locado. Atualmente, são cobrados os seguintes valores: DVD, VHS e HD-DVD – R$ 5,00; Blu-Ray – R$ 7,50, sendo que lançamentos têm um acréscimo de 50% nos valores acima mencionados.

O prazo para devolução é de um dia para lançamentos e três dias para filmes do catálogo. Contudo, o valor a ser efetivamente pago e a data de devolução prevista de um item locado podem ser alterados pelo atendente da locadora para aplicar descontos individualizados ou ampliar prazos de devolução.
Sobre um filme, deseja-se saber: título original, título em português, países, ano, direção, elenco, sinopse, duração e gênero. Os filmes são fornecidos por distribuidoras. De uma distribuidora deseja-se saber a razão social, CNPJ, endereço, telefone e pessoa de contato.

De um item, deseja-se saber a data de aquisição, número de série (código de barras) e tipo de mídia. Clientes locam itens. Um cliente pode ser um cliente titular ou um de seus dependentes. Quando uma pessoa faz sua inscrição na locadora como titular, lhe é dado o direito de indicar até três dependentes, pelos quais será responsável. Para a locadora, é fundamental identificar exatamente quem locou uma fita, se o titular ou um de seus dependentes. Contudo, para efeito de controle, a locadora deseja ter mais informações sobre o titular do que sobre seus dependentes. Sobre um titular, deseja-se saber nome, email, endereço, telefone residencial, local onde trabalha, telefone comercial, telefone celular, sexo, CPF e data de nascimento. Apenas maiores de idade podem ser titulares. De um dependente, são necessários apenas o nome, email, sexo e data de nascimento.

Tanto titulares quanto dependentes têm um número de inscrição, o qual é único por cliente. Clientes podem também reservar filmes. É importante registrar a data e a hora em que a reserva foi feita e o tipo de mídia que o cliente deseja. Assim, é possível atender as reservas por ordem de chegada, por tipo de mídia. Uma locação só pode ser feita para um item, se não houver uma reserva não atendida para o seu filme e mídia. Quando um item de um filme e tipo de mídia reservado é devolvido, comunica-se o cliente interessado por email e, a partir desse momento, o cliente tem 24 horas para retirá-lo; caso contrário, expira-se a reserva e o item é liberado. Não são aceitas reservas para filmes que têm itens do tipo de mídia requerido disponíveis na locadora, nem reservas para datas específicas. Quando a devolução de um item é feita com atraso, cobra-se multa. A multa é calculada como sendo o valor da locação aplicado ao número de dias de atraso. Caso a locação do item não tenha sido paga no ato da locação, terá de ser paga obrigatoriamente na devolução. Não são aceitos pagamentos mensais ou em outros momentos que não a locação ou a devolução. Não é necessário representar o sistema de pagamento, por hora ele será controlado manualmente pelos funcionários, o sistema apenas deverá usar os critérios apresentados (ex: atraso) para calcular e exibir o valor. O módulo de pagamentos será desenvolvido em outro momento.

Consultas ao acervo da locadora devem poder ser feitas pela Internet. Um cliente pode consultar os dados de um filme específico, informando o título (ou parte dele), original ou em português. Também devem ser possíveis consultas por gênero, tipo de mídia disponível, ator, diretor, nacionalidade e lançamentos, bem como combinações dessas informações.
