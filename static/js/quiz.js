const questions = [
  {
    text: "Qual frase mais parece com você hoje?",
    options: [
      { label: "Quero começar na academia, mas morro de vergonha", icon: "🙈" },
      { label: "Já comecei, mas sempre desisto", icon: "😞" },
      { label: "Vou, mas me sinto perdida", icon: "❓" },
      { label: "Treino, mas não vejo resultados", icon: "📉" }
    ]
  },
  {
    text: "O que mais te impede de continuar?",
    options: [
      { label: "Medo de errar", icon: "😨" },
      { label: "Falta de motivação", icon: "🔋" },
      { label: "Falta de tempo", icon: "⏰" },
      { label: "Confusão sobre treino e alimentação", icon: "😵" }
    ]
  },
  {
    text: "Você já tentou treinar antes?",
    options: [
      { label: "Nunca", icon: "❌" },
      { label: "Já tentei e parei", icon: "🛑" },
      { label: "Já treino, mas sem constância", icon: "📉" }
    ]
  },
  {
    text: "O que você mais deseja com a academia?",
    options: [
      { label: "Emagrecer", icon: "⚖️" },
      { label: "Me sentir confiante", icon: "✨" },
      { label: "Ter mais disposição", icon: "⚡" },
      { label: "Me sentir bem com meu corpo", icon: "🥰" }
    ]
  },
  {
    text: "Se tivesse um passo a passo simples, você seguiria?",
    options: [
      { label: "Sim, com certeza", icon: "✅" },
      { label: "Sim, mas tenho medo de desistir", icon: "😟" },
      { label: "Talvez", icon: "🤔" }
    ]
  }
];

// Map options to categories: 0=Insecurity, 1=Consistency, 2=Direction
// This mapping corresponds to the indices of options in the `questions` array.
// Q1: Vergonha (0), Desisto (1), Perdida (2), Sem resultados (2)
// Q2: Medo (0), Motivação (1), Tempo (2), Confusão (2)
// Q3: Nunca (0), Parei (1), Sem constância (1)
// Q4 & Q5 are for data collection, less impact on diagnosis category.
const optionCategories = [
  [0, 1, 2, 2], // Q1
  [0, 1, 2, 2], // Q2
  [0, 1, 1],    // Q3
  [0, 0, 0, 0], // Q4 (Neutral/All)
  [0, 0, 0]     // Q5 (Neutral/All)
];

const resultsData = {
  insecurity: {
    title: "O seu bloqueio é a INSEGURANÇA.",
    desc: "Você evita a academia porque tem medo de ser julgada ou de fazer errado. A boa notícia é que ninguém nasce sabendo. Você só precisa de um guia passo a passo que te dê confiança para treinar sem depender de ninguém."
  },
  consistency: {
    title: "O seu desafio é a CONSTÂNCIA.",
    desc: "Você começa empolgada, mas para na primeira dificuldade. O problema não é sua força de vontade, é a falta de um plano realista. Você precisa de um método que se adapte à sua rotina, e não o contrário."
  },
  direction: {
    title: "O seu problema é a FALTA DE DIREÇÃO.",
    desc: "Você vai para a academia, mas se sente perdida e não vê resultados. Isso gera frustração. Você precisa parar de adivinhar e começar a seguir um plano de treino validado e direto ao ponto."
  }
};

const state = {
  started: false,
  index: 0,
  answers: Array(questions.length).fill(null), // Will store index of selected option
  completed: false
};

const startBtn = document.getElementById("startBtn");
const quizEl = document.getElementById("quiz");
const questionText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const questionCard = document.getElementById("questionCard");
const resultEl = document.getElementById("result");
const ctaBtn = document.getElementById("ctaBtn");

const checkoutUrl = (window.config && window.config.CHECKOUT_URL) ? window.config.CHECKOUT_URL : "#";
if (ctaBtn) ctaBtn.setAttribute("href", checkoutUrl);

function renderQuestion() {
  const q = questions[state.index];
  questionText.textContent = q.text;
  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    // Check by index (i) instead of value to ensure unique selection
    const isSelected = state.answers[state.index] === i;
    btn.className = "option" + (isSelected ? " selected" : "");
    
    // Add icon if available
    const iconSpan = document.createElement("span");
    iconSpan.className = "option-icon";
    iconSpan.textContent = opt.icon || "";
    
    const labelSpan = document.createElement("span");
    labelSpan.className = "option-label";
    labelSpan.textContent = opt.label;
    
    btn.appendChild(iconSpan);
    btn.appendChild(labelSpan);
    
    btn.addEventListener("click", () => {
      state.answers[state.index] = i; // Store index
      renderQuestion();
      nextBtn.disabled = false;
    });
    optionsEl.appendChild(btn);
  });
  backBtn.disabled = state.index === 0;
  nextBtn.textContent = state.index < questions.length - 1 ? "Avançar" : "Ver Resultado";
  nextBtn.disabled = state.answers[state.index] == null;
  progressLabel.textContent = `Pergunta ${Math.min(state.index + 1, questions.length)} de ${questions.length}`;
  progressBar.style.width = `${((state.index + 1) / questions.length) * 100}%`;
}

function showQuiz() {
  document.querySelector(".hero").classList.add("hidden");
  quizEl.classList.remove("hidden");
  questionCard.classList.remove("fade-scale-exit");
  questionCard.classList.add("fade-scale-enter");
  renderQuestion();
  quizEl.scrollIntoView({ behavior: "smooth", block: "start" });
  // Removed quiz timer start
}

function calculateResult() {
  const scores = { 0: 0, 1: 0, 2: 0 }; // 0: Insecurity, 1: Consistency, 2: Direction
  
  // Only count first 3 questions for diagnosis
  for (let i = 0; i < 3; i++) {
    const selectedOptionIndex = state.answers[i];
    if (selectedOptionIndex != null) {
      const category = optionCategories[i][selectedOptionIndex];
      scores[category]++;
    }
  }
  
  // Find winner
  let winner = 0;
  if (scores[1] > scores[0]) winner = 1;
  if (scores[2] > scores[winner]) winner = 2;
  
  // Fallback if tie or logic needs adjustment (default to Insecurity if mainly unsure)
  
  if (winner === 0) return resultsData.insecurity;
  if (winner === 1) return resultsData.consistency;
  return resultsData.direction;
}

function showResult() {
  const result = calculateResult();
  const resultTitle = document.getElementById("resultTitle");
  const resultDesc = document.getElementById("resultDesc");
  
  if (resultTitle) resultTitle.textContent = result.title;
  if (resultDesc) resultDesc.textContent = result.desc;

  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

startBtn.addEventListener("click", () => {
  state.started = true;
  showQuiz();
  if (typeof trackEvent === "function") trackEvent("quiz_start");
});

backBtn.addEventListener("click", () => {
  if (state.index > 0) {
    questionCard.classList.remove("fade-scale-enter");
    questionCard.classList.add("fade-scale-exit");
    setTimeout(() => {
      state.index -= 1;
      questionCard.classList.remove("fade-scale-exit");
      questionCard.classList.add("fade-scale-enter");
      renderQuestion();
    }, 200);
  }
});

nextBtn.addEventListener("click", () => {
  if (state.index < questions.length - 1) {
    questionCard.classList.remove("fade-scale-enter");
    questionCard.classList.add("fade-scale-exit");
    setTimeout(() => {
      state.index += 1;
      questionCard.classList.remove("fade-scale-exit");
      questionCard.classList.add("fade-scale-enter");
      renderQuestion();
    }, 200);
  } else {
    state.completed = true;
    showResult();
    if (typeof trackEvent === "function") trackEvent("quiz_complete");
  }
});

if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    if (typeof trackEvent === "function") trackEvent("cta_click");
  });
}
