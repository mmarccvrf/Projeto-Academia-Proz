import streamlit as st  # Importa a biblioteca principal do Streamlit para interface gráfica
import pandas as pd     # Importa o Pandas para manipulação e exibição de gráficos e tabelas

# ==============================================================================
# 1. MODEL (Camada de Dados e Regras de Negócio)
# ==============================================================================

class GymModel:
    """Classe responsável pela gestão de dados e lógica do sistema."""
    
    def __init__(self):
        # Banco de dados simulado contendo os exercícios e suas alternativas do mesmo grupo muscular
        self.banco_exercicios = {
            "Remada Alta": {
                "grupo": "Costas / Trapezius",
                "substitutos": ["Remada Cavalinho", "Remada Baixa", "Puxada Articulada"]
            },
            "Remada com Barra": {
                "grupo": "Costas",
                "substitutos": ["Remada Unilateral com Halter", "Remada Serrote", "Puxada Alta"]
            },
            "Supino com Halteres": {
                "grupo": "Peitoral",
                "substitutos": ["Supino Reto na Barra", "Cross Over", "Flexão de Braço"]
            }
        }

    def obter_ocupacao_atual(self):
        """Retorna a percentagem e o estado de ocupação da academia em tempo real."""
        return {"percentual": 65, "status": "Fluxo Moderado", "cor": "#ffc107"}

    def obter_substitutos(self, nome_exercicio):
        """Busca no banco os exercícios equivalentes para o mesmo grupo muscular."""
        info = self.banco_exercicios.get(nome_exercicio, {
            "grupo": "Geral",
            "substitutos": ["Exercício Alternativo A", "Exercício Alternativo B"]
        })
        return info["grupo"], info["substitutos"]

    def obter_dados_frequencia(self):
        """Gera os dados estatísticos para exibição do progresso diário, semanal e anual."""
        dados_diario = pd.DataFrame({'Sessão': [1, 2, 3, 4], 'Carga Total (kg)': [1200, 1350, 1300, 1500]})
        dados_semanal = pd.DataFrame({'Semana': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'], 'Dias Frequentados': [3, 4, 3, 5]})
        dados_anual = pd.DataFrame({'Mês': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], 'Presença %': [70, 85, 80, 90, 95]})
        return dados_diario, dados_semanal, dados_anual


# ==============================================================================
# 2. VIEW (Camada de Apresentação e Interface do Utilizador)
# ==============================================================================

class GymView:
    """Classe responsável por renderizar as telas e componentes gráficos no Streamlit."""

    @staticmethod
    def aplicar_estilos_customizados():
        """Aplica estilos CSS para garantir a identidade visual Dark Mode profissional."""
        st.markdown("""
            <style>
            .stApp {
                background-color: #121212;
                color: #FFFFFF;
            }
            .card-ocupacao {
                background-color: #1E1E1E;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                border: 1px solid #333;
            }
            .stButton>button {
                background-color: #28a745;
                color: white;
                font-weight: bold;
                border-radius: 8px;
                border: none;
                width: 100%;
                padding: 10px;
            }
            .stButton>button:hover {
                background-color: #218838;
            }
            .btn-perigo>button {
                background-color: #dc3545 !important;
            }
            .btn-perigo>button:hover {
                background-color: #c82333 !important;
            }
            </style>
        """, unsafe_allow_html=True)

    @staticmethod
    def renderizar_menu():
        """Renderiza a barra de navegação lateral para troca de telas."""
        return st.sidebar.radio("Navegação", ["Home", "Ficha de Treino", "Progresso & Frequência", "Criar Treino"])

    @staticmethod
    def renderizar_home(dados_ocupacao):
        """Renderiza a tela inicial com indicador de frequência/ocupação e treino do dia."""
        st.title("👋 Olá, Atleta!")
        st.caption("Acompanhe a ocupação da sua academia em tempo real.")
        st.markdown("---")
        
        st.subheader("📊 Ocupação da Academia")
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            # Renderiza o medidor de ocupação
            st.markdown(f"""
                <div class="card-ocupacao">
                    <h1 style="color: {dados_ocupacao['cor']}; font-size: 3rem; margin: 0;">{dados_ocupacao['percentual']}%</h1>
                    <p style="color: {dados_ocupacao['cor']}; font-weight: bold; margin: 0;">{dados_ocupacao['status']}</p>
                </div>
            """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)
        st.subheader("🏋️ Treino do Dia")
        st.info("**Treino A:** Costas e Bíceps (3 exercícios)")

    @staticmethod
    def renderizar_modal_substituicao(exercicio_nome, grupo_muscular, lista_substitutos):
        """Renderiza o menu interativo para substituição inteligente do aparelho ocupado."""
        st.warning(f"⚠️ **Aparelho Ocupado:** {exercicio_nome}")
        st.write(f"Trabalha o grupo muscular: **{grupo_muscular}**")
        
        opcao = st.radio("Escolha uma opção alternativa recomendada:", lista_substitutos)
        
        col_ok, col_cancel = st.columns(2)
        confirmar = col_ok.button("✅ Substituir neste treino")
        cancelar = col_cancel.button("❌ Cancelar")
        
        return opcao, confirmar, cancelar

    @staticmethod
    def renderizar_ficha(treino_lista):
        """Renderiza a lista de exercícios com suporte a marcação de conclusão e alerta de ocupação."""
        st.title("📋 Execução do Treino A")
        st.caption("Tempo decorrido: 00:15:32")

        exercicio_ocupado_id = None
        
        for ex in treino_lista:
            with st.expander(f"**{ex['id']}. {ex['nome']}**", expanded=True):
                col_info1, col_info2 = st.columns(2)
                col_info1.write(f"**Repetições:** {ex['reps']}")
                col_info2.write(f"**Carga:** {ex['carga']}")
                
                col_btn1, col_btn2 = st.columns(2)
                if col_btn1.button("Concluir Série", key=f"concluir_{ex['id']}"):
                    st.success(f"Série de {ex['nome']} registrada!")
                
                # Renderiza o botão vermelho para indicar aparelho ocupado
                st.markdown('<div class="btn-perigo">', unsafe_allow_html=True)
                if col_btn2.button("Aparelho Ocupado?", key=f"ocupado_{ex['id']}"):
                    exercicio_ocupado_id = ex['id']
                st.markdown('</div>', unsafe_allow_html=True)

        st.markdown("---")
        st.success("⏱️ **Descanso:** 60 segundos entre as séries")
        return exercicio_ocupado_id

    @staticmethod
    def renderizar_progresso(df_diario, df_semanal, df_anual):
        """Renderiza os gráficos de acompanhamento de frequência e volume de treino."""
        st.title("📈 Seu Progresso e Frequência")

        st.subheader("🔴 Volume Diário (Carga Acumulada)")
        st.line_chart(df_diario.set_index('Sessão'), color="#dc3545")

        st.subheader("🔵 Frequência Semanal (Dias Ativos)")
        st.bar_chart(df_semanal.set_index('Semana'), color="#007bff")

        st.subheader("🟢 Assiduidade Anual (% de Presença)")
        st.line_chart(df_anual.set_index('Mês'), color="#28a745")

    @staticmethod
    def renderizar_criacao_treino():
        """Renderiza o formulário de cadastro de novos exercícios na ficha."""
        st.title("✏️ Criar / Editar Ficha de Treino")
        nome = st.text_input("Nome do Exercício")
        reps = st.text_input("Repetições (Ex: 3x12)")
        carga = st.text_input("Carga Inicial (Ex: 20 kg)")
        btn_salvar = st.button("Adicionar ao Treino")
        return nome, reps, carga, btn_salvar


# ==============================================================================
# 3. CONTROLLER (Camada de Controle e Orquestração do Fluxo)
# ==============================================================================

class GymController:
    """Classe responsável por interligar o Model e a View, gerindo o estado da sessão."""

    def __init__(self):
        # Instancia as camadas Model e View
        self.model = GymModel()
        self.view = GymView()
        
        # Inicializa as variáveis no estado persistente da sessão (Session State)
        self._inicializar_estado_sessao()

    def _inicializar_estado_sessao(self):
        """Garante que as variáveis globais de estado existam no Streamlit."""
        if 'treino_atual' not in st.session_state:
            st.session_state.treino_atual = [
                {"id": 1, "nome": "Remada com Barra", "reps": "12", "carga": "60 kg"},
                {"id": 2, "nome": "Remada Alta", "reps": "10", "carga": "40 kg"},
                {"id": 3, "nome": "Supino com Halteres", "reps": "12", "carga": "22 kg"}
            ]
        if 'substituindo_id' not in st.session_state:
            st.session_state.substituindo_id = None

    def executar(self):
        """Função principal para coordenar a execução da aplicação."""
        # Aplica o CSS customizado
        self.view.aplicar_estilos_customizados()
        
        # Obtém a opção selecionada no menu
        opcao_menu = self.view.renderizar_menu()

        # Rota: HOME
        if opcao_menu == "Home":
            dados_ocupacao = self.model.obter_ocupacao_atual()
            self.view.renderizar_home(dados_ocupacao)

        # Rota: FICHA DE TREINO E SUBSTITUIÇÃO
        elif opcao_menu == "Ficha de Treino":
            # Caso o utilizador tenha clicado em "Aparelho Ocupado", abre o fluxo de substituição inteligente
            if st.session_state.substituindo_id is not None:
                ex_id = st.session_state.substituindo_id
                ex_atual = next(item for item in st.session_state.treino_atual if item["id"] == ex_id)
                
                # Consulta o Model para encontrar opções para o mesmo grupo muscular
                grupo, substitutos = self.model.obter_substitutos(ex_atual["nome"])
                
                # Exibe a View de substituição
                opcao, confirmar, cancelar = self.view.renderizar_modal_substituicao(ex_atual["nome"], grupo, substitutos)

                if confirmar:
                    # Atualiza o estado no Model
                    ex_atual["nome"] = opcao
                    st.session_state.substituindo_id = None
                    st.rerun()
                elif cancelar:
                    st.session_state.substituindo_id = None
                    st.rerun()

            # Caso padrão: exibe a lista do treino
            else:
                ocupado_id = self.view.renderizar_ficha(st.session_state.treino_atual)
                if ocupado_id is not None:
                    st.session_state.substituindo_id = ocupado_id
                    st.rerun()

        # Rota: PROGRESSO & FREQUÊNCIA
        elif opcao_menu == "Progresso & Frequência":
            df_d, df_s, df_a = self.model.obter_dados_frequencia()
            self.view.renderizar_progresso(df_d, df_s, df_a)

        # Rota: CRIAR TREINO
        elif opcao_menu == "Criar Treino":
            nome, reps, carga, btn_salvar = self.view.renderizar_criacao_treino()
            if btn_salvar:
                if nome and reps and carga:
                    novo_id = len(st.session_state.treino_atual) + 1
                    st.session_state.treino_atual.append({"id": novo_id, "nome": nome, "reps": reps, "carga": carga})
                    st.success(f"Exercício '{nome}' adicionado com sucesso!")
                    st.rerun()
                else:
                    st.error("Por favor, preencha todos os campos do formulário.")


# ==============================================================================
# PONTO DE ENTRADA DA APLICAÇÃO
# ==============================================================================
if __name__ == "__main__":
    # Instancia o Controller e executa o ciclo de vida da aplicação
    app = GymController()
    app.executar()