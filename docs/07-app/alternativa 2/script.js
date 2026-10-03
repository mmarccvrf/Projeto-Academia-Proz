let selectedAlternativeText = "";
let currentReplacingIndex = 1;
let currentExercises = [];
let restTimerInterval = null;

// Fallback de segurança com os 10 exercícios da API caso ocorra falha de rede/offline
const fallbackExercises = [
    {
        exerciseId: "01qpYSe",
        name: "upward facing dog",
        bodyParts: ["back"],
        equipaments: ["bodyweight"],
        secondaryMuscles: ["deltoids", "pectorals"],
        targetMuscle: ["erector spinae"],
        otherExercises: [
            { name: "barbell seated bradford rocky press", equipaments: ["barbell"] },
            { name: "band underhand pulldown", equipaments: ["resistance band"] }
        ]
    },
    {
        exerciseId: "03lzqwk",
        name: "assisted hanging knee raise",
        bodyParts: ["waist"],
        equipaments: ["assisted"],
        secondaryMuscles: ["hip flexors"],
        targetMuscle: ["abdominals"],
        otherExercises: [
            { name: "push-up inside leg kick", equipaments: ["bodyweight"] },
            { name: "dumbbell burpee", equipaments: ["dumbbell"] }
        ]
    },
    {
        exerciseId: "05Cf2v8",
        name: "impossible dips",
        bodyParts: ["upper arms"],
        equipaments: ["bodyweight"],
        secondaryMuscles: ["pectorals", "deltoids"],
        targetMuscle: ["triceps"],
        otherExercises: [
            { name: "Cable Crossover", equipaments: ["cable"] },
            { name: "band underhand pulldown", equipaments: ["resistance band"] }
        ]
    },
    {
        exerciseId: "0br45wL",
        name: "push-up inside leg kick",
        bodyParts: ["upper legs"],
        equipaments: ["bodyweight"],
        secondaryMuscles: ["quadriceps", "hamstrings", "calves"],
        targetMuscle: ["glutes"],
        otherExercises: [
            { name: "assisted hanging knee raise", equipaments: ["assisted"] },
            { name: "roller hip lat stretch", equipaments: ["roller"] }
        ]
    },
    {
        exerciseId: "0CXGHya",
        name: "Cable Crossover",
        bodyParts: ["chest"],
        equipaments: ["cable"],
        secondaryMuscles: ["deltoids", "triceps"],
        targetMuscle: ["pectorals"],
        otherExercises: [
            { name: "upward facing dog", equipaments: ["bodyweight"] },
            { name: "impossible dips", equipaments: ["bodyweight"] }
        ]
    },
    {
        exerciseId: "0dCyly0",
        name: "barbell seated bradford rocky press",
        bodyParts: ["shoulders"],
        equipaments: ["barbell"],
        secondaryMuscles: ["triceps", "upper back"],
        targetMuscle: ["deltoids"],
        otherExercises: [
            { name: "smith upright row", equipaments: ["smith machine"] },
            { name: "EZ-Bar Standing French Press", equipaments: ["EZ bar"] }
        ]
    },
    {
        exerciseId: "0I5fUyn",
        name: "band underhand pulldown",
        bodyParts: ["back"],
        equipaments: ["resistance band"],
        secondaryMuscles: ["biceps", "forearms"],
        targetMuscle: ["latissimus dorsi"],
        otherExercises: [
            { name: "Pull-Up (Neutral Grip)", equipaments: ["bodyweight"] },
            { name: "cable pulldown (pro lat bar)", equipaments: ["cable"] }
        ]
    },
    {
        exerciseId: "0IgNjSM",
        name: "dumbbell standing reverse curl",
        bodyParts: ["upper arms"],
        equipaments: ["dumbbell"],
        secondaryMuscles: ["forearms"],
        targetMuscle: ["biceps"],
        otherExercises: [
            { name: "impossible dips", equipaments: ["bodyweight"] },
            { name: "dumbbell burpee", equipaments: ["dumbbell"] }
        ]
    },
    {
        exerciseId: "0jp9Rlz",
        name: "Single-Leg Floor Calf Raise",
        bodyParts: ["lower legs"],
        equipaments: ["bodyweight"],
        secondaryMuscles: ["ankles", "feet"],
        targetMuscle: ["calves"],
        otherExercises: [
            { name: "runners stretch", equipaments: ["bodyweight"] },
            { name: "Smith Seated Single-Leg Calf Raise", equipaments: ["smith machine"] }
        ]
    },
    {
        exerciseId: "0JtKWum",
        name: "dumbbell burpee",
        bodyParts: ["cardio"],
        equipaments: ["dumbbell"],
        secondaryMuscles: ["quadriceps", "hamstrings", "calves", "core"],
        targetMuscle: ["cardiovascular system"],
        otherExercises: [
            { name: "bear crawl", equipaments: ["bodyweight"] },
            { name: "Jack Jump", equipaments: ["bodyweight"] }
        ]
    }
];

// Helper para formatar o nome dos exercícios (Primeira letra maiúscula)
function formatExerciseName(name) {
    if (!name) return "";
    return name
        .toLowerCase()
        .split(' ')
        .map(word => {
            if (!word) return '';
            return word
                .split('-')
                .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                .join('-');
        })
        .join(' ');
}

// Helper para selecionar emoji de acordo com o equipamento ou músculo
function getExerciseEmoji(exercise) {
    const eq = (exercise.equipaments && exercise.equipaments[0] ? exercise.equipaments[0].toLowerCase() : '');
    const bp = (exercise.bodyParts && exercise.bodyParts[0] ? exercise.bodyParts[0].toLowerCase() : '');
    const target = (exercise.targetMuscle && exercise.targetMuscle[0] ? exercise.targetMuscle[0].toLowerCase() : '');

    if (eq.includes('barbell') || eq.includes('dumbbell')) return '🏋️‍♂️';
    if (eq.includes('cable') || eq.includes('machine') || eq.includes('smith') || eq.includes('sled')) return '⚙️';
    if (eq.includes('band')) return '🎗️';
    if (bp.includes('cardio') || target.includes('cardiovascular')) return '🏃‍♂️';
    if (bp.includes('legs') || target.includes('calves') || target.includes('glutes') || target.includes('quadriceps')) return '🦵';
    if (bp.includes('arms') || target.includes('biceps') || target.includes('triceps')) return '💪';
    if (target.includes('abdominals') || bp.includes('waist')) return '🧘‍♂️';
    return '🏋️‍♂️';
}

// Helper para estimar carga inicial padrão
function getDefaultKg(exercise) {
    const eq = (exercise.equipaments && exercise.equipaments[0] ? exercise.equipaments[0].toLowerCase() : '');
    if (eq.includes('bodyweight')) return 0;
    if (eq.includes('band')) return 15;
    if (eq.includes('dumbbell')) return 16;
    if (eq.includes('barbell')) return 50;
    if (eq.includes('cable')) return 35;
    if (eq.includes('smith')) return 40;
    if (eq.includes('assisted')) return 25;
    return 20;
}

// Renderizar os 10 boxes de exercícios
function renderExercises(exercises) {
    const container = document.getElementById('exercise-accordion') || document.querySelector('.exercise-accordion');
    if (!container) return;

    currentExercises = exercises;

    container.innerHTML = exercises.map((exercise, index) => {
        const itemNumber = index + 1;
        const formattedTitle = formatExerciseName(exercise.name);
        const emoji = getExerciseEmoji(exercise);
        const equipName = (exercise.equipaments && exercise.equipaments[0] ? exercise.equipaments[0] : 'CORPO').toUpperCase();
        const targetMuscle = exercise.targetMuscle ? exercise.targetMuscle.join(', ') : 'Geral';
        const bodyPart = exercise.bodyParts ? exercise.bodyParts.join(', ') : 'Geral';
        const defaultKg = getDefaultKg(exercise);

        return `
            <div class="exercise-item" id="exercise-item-${index}">
                <div class="exercise-header-item" onclick="toggleExerciseAccordion(${index})">
                    <span id="txt-ex-${itemNumber}">${itemNumber}. ${formattedTitle}</span>
                    <span class="exercise-arrow" id="arrow-ex-${index}">▲</span>
                </div>
                
                <div class="exercise-content" id="content-ex-${index}">
                    <div class="exercise-media-placeholder">
                        <div class="gif-badge">GIF • ${equipName}</div>
                        <div class="inner-media-simulation">${emoji}</div>
                        <div class="exercise-target-badge">Alvo: ${targetMuscle}</div>
                    </div>

                    <div class="set-card-box">
                        <div class="set-row-title">
                            <span>Set 1</span>
                            <span class="set-target-info">${bodyPart}</span>
                        </div>
                        <div class="set-inputs">
                            <div class="input-block">
                                <label>Reps</label>
                                <input type="number" value="12" disabled>
                            </div>
                            <div class="input-block">
                                <label>Kg</label>
                                <input type="number" value="${defaultKg}" ${index === 0 ? 'id="weight-value"' : `id="weight-value-${itemNumber}"`}>
                            </div>
                        </div>
                        <button class="btn-done" ${index === 0 ? 'id="btn-concluir"' : ''} onclick="triggerRestTimer(this)">✓ Concluído</button>
                    </div>

                    <button class="btn-occupied" ${index === 1 ? 'id="btn-occupied-trigger"' : ''} onclick="openOccupationModal(${index})">Aparelho Ocupado?</button>
                </div>
            </div>
        `;
    }).join('');
}

// Fetch dinâmico da API
async function fetchExercises() {
    const container = document.getElementById('exercise-accordion') || document.querySelector('.exercise-accordion');
    
    try {
        const response = await fetch('https://serverapi.space/academia/exercises');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        let exercises = [];
        if (result && Array.isArray(result.data)) {
            exercises = result.data;
        } else if (Array.isArray(result)) {
            exercises = result;
        }

        // Listar 10 itens da API
        if (exercises.length > 0) {
            const tenExercises = exercises.slice(0, 10);
            renderExercises(tenExercises);
        } else {
            renderExercises(fallbackExercises);
        }
    } catch (error) {
        console.warn("Erro ao buscar exercícios da API, utilizando dados de contingência:", error);
        // Fallback garantido para caso de indisponibilidade de rede
        renderExercises(fallbackExercises);
    }
}

// Alternar expansão/recolhimento do acordeão
function toggleExerciseAccordion(index) {
    const item = document.getElementById(`exercise-item-${index}`);
    if (!item) return;

    const arrow = document.getElementById(`arrow-ex-${index}`);
    const isCollapsed = item.classList.contains('collapsed');

    if (isCollapsed) {
        item.classList.remove('collapsed');
        if (arrow) arrow.innerText = "▲";
    } else {
        item.classList.add('collapsed');
        if (arrow) arrow.innerText = "▼";
    }
}

// Gerenciador SPA de Telas
function navigateTo(screenId, navElement) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (navElement) {
        navElement.classList.add('active');
    } else {
        const matchingBtn = document.querySelector(`.nav-btn[onclick*="${screenId}"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }
}

// Controle do Modal Sheet Inferior
function openOccupationModal(exerciseIndex) {
    currentReplacingIndex = (typeof exerciseIndex === 'number') ? exerciseIndex : 1;
    selectedAlternativeText = "";

    const modal = document.getElementById('occupation-modal');
    const container = document.getElementById('modal-options-container') || document.querySelector('.options-container');

    // Identificar opções alternativas do exercício atual
    const exercise = currentExercises[currentReplacingIndex];
    let altA = "Remada Unilateral com Halter";
    let altB = "Pulldown na Polia";
    let iconA = "🏋️";
    let iconB = "⚙️";

    if (exercise && Array.isArray(exercise.otherExercises) && exercise.otherExercises.length >= 2) {
        altA = formatExerciseName(exercise.otherExercises[0].name);
        altB = formatExerciseName(exercise.otherExercises[1].name);
        iconA = getExerciseEmoji(exercise.otherExercises[0]);
        iconB = getExerciseEmoji(exercise.otherExercises[1]);
    }

    if (container) {
        container.innerHTML = `
            <div class="option-row" onclick="selectAlternative('Opção A: ${altA}', this)">
                <div class="option-icon">${iconA}</div>
                <div class="option-details">
                    <strong>Opção A:</strong>
                    <p>${altA}</p>
                </div>
            </div>

            <div class="option-row" onclick="selectAlternative('Opção B: ${altB}', this)">
                <div class="option-icon">${iconB}</div>
                <div class="option-details">
                    <strong>Opção B:</strong>
                    <p>${altB}</p>
                </div>
            </div>
        `;
    }

    if (modal) {
        modal.classList.add('open');
    }
}

function closeOccupationModal() {
    const modal = document.getElementById('occupation-modal');
    if (modal) modal.classList.remove('open');
}

function handleModalOverlayClick(event) {
    if (event.target.id === 'occupation-modal') {
        closeOccupationModal();
    }
}

// Seleção de Item Alternativo dentro do Modal
function selectAlternative(name, element) {
    selectedAlternativeText = name;
    document.querySelectorAll('.option-row').forEach(row => row.classList.remove('selected'));
    const target = element || (event && event.currentTarget);
    if (target) {
        target.classList.add('selected');
    }
}

// Execução da Substituição de Exercício
function confirmSubstitution() {
    if (!selectedAlternativeText) {
        alert("Por favor, selecione uma das opções alternativas primeiro!");
        return;
    }

    const cleanName = selectedAlternativeText.replace(/^Opção [A-Z]:\s*/i, "").trim();
    const itemNumber = currentReplacingIndex + 1;
    const targetEl = document.getElementById(`txt-ex-${itemNumber}`) || document.getElementById('txt-ex-2');
    
    if (targetEl) {
        targetEl.innerText = `${itemNumber}. ${cleanName}`;
    }

    if (currentExercises[currentReplacingIndex]) {
        currentExercises[currentReplacingIndex].name = cleanName;
    }

    closeOccupationModal();
    alert("Exercício atualizado com sucesso!");
}

// Disparador do Cronômetro de Descanso Verde
function triggerRestTimer(btnElement) {
    const btn = btnElement || document.getElementById('btn-concluir');
    const footerTimer = document.getElementById('footer-timer');
    const countdownSec = document.getElementById('countdown-sec');
    
    if (btn) {
        btn.disabled = true;
        btn.innerText = "✓ Concluído";
        btn.style.opacity = "0.5";
    }

    if (footerTimer) footerTimer.classList.remove('hidden-timer');
    let timeLeft = 60;
    if (countdownSec) countdownSec.innerText = timeLeft;

    if (restTimerInterval) {
        clearInterval(restTimerInterval);
    }

    restTimerInterval = setInterval(() => {
        timeLeft--;
        if (countdownSec) countdownSec.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(restTimerInterval);
            if (footerTimer) footerTimer.classList.add('hidden-timer');
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = "1";
            }
            alert("Tempo de descanso encerrado! Próxima série.");
        }
    }, 1000);
}

// Configurações de acessibilidade para tamanho de fonte
let currentSize = 16;
const minSize = 12;
const maxSize = 22;

function changeFontSize(modifier) {
    currentSize += modifier;
    if (currentSize < minSize) currentSize = minSize;
    if (currentSize > maxSize) currentSize = maxSize;
    document.documentElement.style.setProperty('--base-font-size', currentSize + 'px');
}

function resetFontSize() {
    currentSize = 16;
    document.documentElement.style.setProperty('--base-font-size', '16px');
}

// Inicializar carregamento ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchExercises);
} else {
    fetchExercises();
}
