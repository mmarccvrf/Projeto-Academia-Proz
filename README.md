# 🏋️‍♂️ Smart Gym App — MVP

> Um web app responsivo (mobile-first) focado na otimização de tempo dentro da academia, eliminando gargalos de espera de aparelhos e auxiliando na autonomia dos treinos.

---

## 📌 Sobre o Projeto

O **Smart Gym** foi concebido para resolver uma dor real de frequentadores de academia: o tempo perdido esperando equipamentos liberarem ou a dependência de instrutores para adaptar a ficha de exercícios em horários de pico. 

O ecossistema do repositório foi construído seguindo rigorosamente as boas práticas de **Product Design (UX/UI)** e **Engenharia de Software**, dividindo o ciclo de vida do produto em etapas claras de validação e desenvolvimento.

---

## 🗂️ Estrutura do Repositório

A organização das pastas reflete o processo de descoberta, design e codificação do ecossistema do produto:

*   **`00-checklist-ux/`** — Checklist contendo as atividades propostas para este projeto.
*   **`01-especificacao-produto/`** — Documento de Requisitos do Produto (PRD) com escopo de MVP, objetivos de negócio e especificações funcionais por módulo.
*   **`02-questionario-ux/`** — Questinário com base nos conceitos abordados em UX, UI, CMS, Domínios e Hospedagem.
*   **`03-elaboracao-persona/`** — Personas detalhadas mapeando perfis comportamentais (ex: o profissional focado em eficiência e a usuária em busca de autonomia).
*   **`04-elaboracao-wireframe/`** — Esboços de baixa fidelidade e arquitetura de informação das telas do aplicativo.
*   **`05-elaboracao-prototipo/`** — Fluxos de navegação e testes de usabilidade interativos intermédios.
*   **`06-elaboracao-ui/`** — Interface de alta fidelidade (Dark Theme) com a identidade visual consolidada e componentes finais.
*   **`07-app/`** — Código-fonte de versões de MVP desenvolvidos com vários tipos de tecnologias.
*   **`08-acessibilidade/`** — Implementação de ferramentas de inclusão, como o motor de redimensionamento proporcional de fontes via variáveis CSS (`rem`).
*   **`09-hospedagem/`** — Arquivos de configuração, pipelines ou links para o deploy contínuo do ambiente de demonstração.

---

## 📱 Funcionalidades do MVP (Módulo `07-app`)

1.  **Home Dashboard:** Monitoramento de ocupação da academia em tempo real com gráfico dinâmico e atalho rápido para o treino do dia.
2.  **Execução do Treino:** Listagem de exercícios com simulação de mídia explicativa (GIF), controle de séries e cronômetro de descanso regressivo automatizado.
3.  **Aparelho Ocupado (Substituição Inteligente):** Modal/Sheet inferior acionado pelo usuário que sugere instantaneamente duas alternativas equivalentes (pesos livres ou polias) e altera a ficha em tempo real.
4.  **Histórico e Progresso:** Gráfico de evolução por grupo muscular e matriz de consistência anual inspirada no modelo de contribuições do GitHub.

---

## 🛠️ Tecnologias Utilizadas

*   **HTML5** (Estruturação Semântica)
*   **CSS3** (Layout Flexbox/Grid, Variáveis Nativas e Animações Mobile)
*   **JavaScript (ES6+)** (Manipulação de DOM, SPA Router Emulado e Cronômetros)

---

## 🚀 Como Executar o Projeto Localmente

1. Clone este repositório na sua máquina:
   ```bash
   git clone https://github.com
   ```
2. Navegue até a pasta do aplicativo:
   ```bash
   cd smart-gym-app/07-app
   ```
3. Abra o arquivo `index.html` diretamente em qualquer navegador web ou utilize a extensão **Live Server** no VS Code para simular o ambiente de servidor.
4. Para uma experiência ideal, abra a ferramenta de desenvolvedor do navegador (`F12`) e ative o **Modo de Visualização Responsiva (Mobile)**.

---

## ♿ Recursos de Acessibilidade

O projeto conta com controles nativos na pasta `08-acessibilidade` que permitem ao usuário aumentar (`A+`) ou diminuir (`A-`) a tipografia de todo o sistema de maneira linear e responsiva, respeitando as diretrizes de acessibilidade web.

