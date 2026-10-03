# Documento de Requisitos do Produto (PRD) — App Projeto Academia Proz

Objetivo do Documento: Guiar o time de engenharia e design no desenvolvimento de um web app responsivo focado na otimização de tempo em academias.

## 1. Visão Geral e Objetivo do Produto

O Projeto Academia Proz é um aplicativo web responsivo (focado em uso mobile) que atua como um assistente digital em tempo real para alunos de academia.

- O Problema: Usuários perdem muito tempo na academia esperando aparelhos liberarem ou sem saber como substituir um exercício de forma eficiente quando o equipamento está ocupado.

- O Objetivo: Otimizar o tempo do usuário na academia, oferecendo um guia dinâmico de treino, monitoramento de lotação e substituição inteligente de exercícios em um clique.

## 2. Requisitos Funcionais por Módulo

### 📲 Tela 1: Home Dashboard

Interface inicial onde o usuário tem o panorama do seu dia antes ou ao chegar na academia.

- RF1.1 - Indicador de Ocupação: Exibir um gráfico circular em tempo real com a porcentagem de ocupação da academia (Ex: "65% - Fluxo Moderado").

- RF1.2 - Treino do Dia: Exibir um card destacado com o foco do treino agendado para a data atual (Ex: "Treino do Dia: A - Costas & Bíceps").

- RF1.3 - Ação Principal: Botão fixo e destacado para "Iniciar Treino", que direciona o usuário para a tela de execução.

- RF1.4 - Barra de Navegação: Menu inferior (Footer) fixo com atalhos para: Home, Treino, Progresso e Perfil.

### 🏋️ Tela 2: Execução do Treino

O coração do aplicativo. Funciona como um cronômetro e instrutor digital passo a passo.

- RF2.1 - Lista Vertical de Exercícios: Exibir os exercícios ordenados numericamente (Ex: 1. Remada com Barra, 2. Puxada Alta).

- RF2.2 - Demonstração Visual: Cada exercício deve conter uma imagem animada (GIF) curta mostrando a execução correta do movimento.

- RF2.3 - Registro de Séries (Sets): Entrada de dados para o usuário validar as repetições (Reps) e a carga utilizada (Kg).

- RF2.4 - Cronômetro de Descanso: Ao clicar em "Concluído" em uma série, o sistema deve disparar um contador visual regressivo de descanso (Ex: "Descanso: 60s").

- RF2.5 - Alerta de Impedimento: Um botão secundário visível "Aparelho Ocupado?" abaixo do exercício atual.

### 🔄 Tela 3: Aparelho Ocupado (Substituição Inteligente)

Garante a fluidez do treino sem interrupções por falta de maquinário livre.

- RF3.1 - Gatilho de Ocupação: Ao clicar em "Aparelho Ocupado?", abre-se uma tela sobreposta (modal/pop-up) contextualizada.

- RF3.2 - Sugestões Alternativas: O sistema deve listar obrigatoriamente duas alternativas de exercícios equivalentes (mesmo grupo muscular e estímulo):
	
	- Opção A: Substituição usando pesos livres (Halteres/Anilhas).
	
	- Opção B: Substituição usando polias ou cabos.

- RF3.3 - Aplicação da Mudança: Botão "Substituir neste treino" que, ao ser clicado, altera dinamicamente a lista da tela de "Execução de Treino" para o exercício escolhido apenas na sessão atual.

### 📈 Tela 4: Histórico e Progresso

Garante o engajamento de longo prazo através da visualização de resultados.

- RF4.1 - Progresso Semanal: Gráfico de linha mostrando a frequência ou a carga acumulada por grupo muscular durante a semana (dias 1 a 7).

- RF4.2 - Histórico Mensal/Anual: Calendário estilo matriz (estilo commits do GitHub) onde os dias em que houve treino ficam destacados em verde, permitindo ver a consistência ao longo dos meses.

## 3. Requisitos Não-Funcionais (RNF)

- RNF3.1 - Responsividade: A interface deve ser desenvolvida sob a filosofia Mobile-First. Embora seja um app web (URL), a experiência deve mimetizar um aplicativo nativo no celular.

- RNF3.2 - Desempenho (Performance): Os GIFs de execução de exercício devem ser altamente otimizados (ou convertidos para formatos de vídeo leves como WebM/MP4 compactados) para não estourar o plano de dados móveis do usuário dentro da academia.

- RNF3.3 - Estado Persistente: Se a página web sofrer um recarregamento (refresh) acidental durante o treino, o cronômetro e o progresso da sessão atual não podem ser perdidos (usar LocalStorage ou persistência em banco).

## 4. Critérios de Aceite para Validação (MVP)

- 1. O usuário consegue iniciar e terminar um treino salvando pelo 
menos 1 série de dados.

- 2. O botão "Aparelho Ocupado" altera com sucesso o exercício 
atual na lista por uma das opções sugeridas.

- 3. O gráfico de histórico exibe o marcador verde no dia em que o 
treino foi finalizado.

