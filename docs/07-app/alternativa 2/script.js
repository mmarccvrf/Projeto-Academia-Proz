let selectedAlternativeText = "";

// Gerenciador SPA de Telas
function navigateTo(screenId, navElement) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (navElement) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        navElement.classList.add('active');
    }
}

// Controle do Modal Sheet Inferior
function openOccupationModal() {
    document.getElementById('occupation-modal').classList.add('open');
}

function closeOccupationModal() {
    document.getElementById('occupation-modal').classList.remove('open');
}

// Seleção de Item Alternativo dentro do Modal
function selectAlternative(name) {
    selectedAlternativeText = name;
    document.querySelectorAll('.option-row').forEach(row => row.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

// Execução da Substituição de Exercício da Tela 3
function confirmSubstitution() {
    if (!selectedAlternativeText) {
        alert("Por favor, selecione uma das opções alternativas primeiro!");
        return;
    }
    // Remove o prefixo para exibição limpa
    const cleanName = selectedAlternativeText.replace("Opção A: ", "").replace("Opção B: ", "");
    document.getElementById('txt-ex-2').innerText = "2. " + cleanName;
    closeOccupationModal();
    alert("Exercício atualizado com sucesso!");
}

// Disparador do Cronômetro de Descanso Verde (Matching UI)
function triggerRestTimer() {
    const btn = document.getElementById('btn-concluir');
    const footerTimer = document.getElementById('footer-timer');
    const countdownSec = document.getElementById('countdown-sec');
    
    btn.disabled = true;
    btn.innerText = "✓ Concluído";
    btn.style.opacity = "0.5";

    footerTimer.classList.remove('hidden-timer');
    let timeLeft = 60;

    const timerInterval = setInterval(() => {
        timeLeft--;
        countdownSec.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            footerTimer.classList.add('hidden-timer');
            btn.disabled = false;
            btn.style.opacity = "1";
            alert("Tempo de descanso encerrado! Próxima série.");
        }
    }, 1000);
}

// Configurações de limite para não quebrar o layout
let currentSize = 16; // Tamanho inicial em pixels
const minSize = 12;
const maxSize = 22;

function changeFontSize(modifier) {
    currentSize += modifier;
    
    // Garante que fique dentro dos limites mínimo e máximo
    if (currentSize < minSize) currentSize = minSize;
    if (currentSize > maxSize) currentSize = maxSize;
    
    // Aplica o novo tamanho na raiz do documento
    document.documentElement.style.setProperty('--base-font-size', currentSize + 'px');
}

function resetFontSize() {
    currentSize = 16;
    document.documentElement.style.setProperty('--base-font-size', '16px');
}

