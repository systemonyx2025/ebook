const questions = [
  {
    text: "Quando o dia começa, como está seu nível de foco e energia?",
    options: [
      { label: "Disperso, cansado, sem direção", value: 0 },
      { label: "Consigo focar em partes, mas vario muito", value: 1 },
      { label: "Entro em ritmo e mantenho bem", value: 2 }
    ]
  },
  {
    text: "Com que frequência você adia tarefas importantes?",
    options: [
      { label: "Quase sempre", value: 0 },
      { label: "Às vezes", value: 1 },
      { label: "Raramente", value: 2 }
    ]
  },
  {
    text: "Como você percebe sua mente ao longo do dia?",
    options: [
      { label: "Acelerada, ansiosa, difícil de desacelerar", value: 0 },
      { label: "Oscila entre tensão e presença", value: 1 },
      { label: "Predominantemente calma e presente", value: 2 }
    ]
  },
  {
    text: "Seus objetivos estão claros para esta semana?",
    options: [
      { label: "Não, estão confusos ou mudam", value: 0 },
      { label: "Tenho alguns claros, outros nebulosos", value: 1 },
      { label: "Estão definidos e priorizados", value: 2 }
    ]
  },
  {
    text: "Consegue manter consistência nas ações?",
    options: [
      { label: "Começo bem e interrompo com frequência", value: 0 },
      { label: "Tenho semanas boas e ruins", value: 1 },
      { label: "Mantenho uma linha estável", value: 2 }
    ]
  },
  {
    text: "Você se sente sempre ocupado, mas pouco produtivo?",
    options: [
      { label: "Sim, o tempo some sem resultado", value: 0 },
      { label: "Em parte, depende da semana", value: 1 },
      { label: "Não, vejo avanços concretos", value: 2 }
    ]
  },
  {
    text: "Quando enfrenta bloqueios, como reage?",
    options: [
      { label: "Forço mais sem estratégia", value: 0 },
      { label: "Tento ajustar, mas sem método", value: 1 },
      { label: "Pauso, reavalio e sigo com método", value: 2 }
    ]
  }
];

function classify(score) {
  if (score <= 6) {
    return {
      title: "Preso no Modo Automático",
      desc: "Você está operando no automático. Não é falta de esforço. É a ausência de estrutura, clareza e método. Com pequenos ajustes, sua energia e foco podem voltar ao centro."
    };
  }
  if (score <= 10) {
    return {
      title: "Em Processo de Despertar",
      desc: "Você já percebe o que precisa mudar e começa a ajustar rotas. O próximo passo é transformar intenção em consistência com um método simples e aplicável."
    };
  }
  return {
    title: "Pronto para Assumir o Controle",
    desc: "Você tem base de consciência e direção. Com um método claro, a consistência se torna natural e os resultados crescem sem sobrecarga."
  };
}

const state = {
  started: false,
  index: 0,
  answers: Array(questions.length).fill(null),
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
const resultTitle = document.getElementById("resultTitle");
const resultDesc = document.getElementById("resultDesc");
const ctaBtn = document.getElementById("ctaBtn");
const focusTimerEl = document.getElementById("focusTimer");
let timerInterval = null;
let timerSeconds = 7 * 60;
const checkoutUrl = (window.__CONFIG__ && window.__CONFIG__.CHECKOUT_URL) ? window.__CONFIG__.CHECKOUT_URL : "#";
if (ctaBtn) ctaBtn.setAttribute("href", checkoutUrl);

function renderQuestion() {
  const q = questions[state.index];
  questionText.textContent = q.text;
  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option" + (state.answers[state.index] === opt.value ? " selected" : "");
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      state.answers[state.index] = opt.value;
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
  startTimer();
}

function showResult() {
  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
  const score = state.answers.filter(v => v != null).reduce((a, b) => a + b, 0);
  const res = classify(score);
  resultTitle.textContent = res.title;
  resultDesc.textContent = res.desc;
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

ctaBtn.addEventListener("click", () => {
  if (typeof trackEvent === "function") trackEvent("cta_click");
});

function startTimer() {
  if (!focusTimerEl) return;
  if (timerInterval) clearInterval(timerInterval);
  updateTimerText();
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds -= 1;
      updateTimerText();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function updateTimerText() {
  const mm = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const ss = String(timerSeconds % 60).padStart(2, "0");
  focusTimerEl.textContent = `${mm}:${ss}`;
}
