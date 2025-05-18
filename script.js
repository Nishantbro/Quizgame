const questions = [
  // HTML Questions
  {
    question: "What does the `<meta>` tag do in HTML?",
    options: ["Defines a paragraph", "Specifies metadata about the document", "Creates a hyperlink", "Embeds an image"],
    correctAnswer: 1,
    explanation: "The `<meta>` tag provides metadata like charset or viewport settings, not visible on the page."
  },
  {
    question: "Which tag is used to create a numbered list?",
    options: ["<ul>", "<ol>", "<li>", "<dl>"],
    correctAnswer: 1,
    explanation: "The `<ol>` tag creates an ordered (numbered) list, while `<ul>` creates an unordered (bulleted) list."
  },
  {
    question: "What is the purpose of the `alt` attribute in an `<img>` tag?",
    options: ["Sets the image size", "Provides alternative text for accessibility", "Links to another page", "Changes the image border"],
    correctAnswer: 1,
    explanation: "The `alt` attribute provides text for screen readers and displays if the image fails to load."
  },
  {
    question: "Which HTML element is used for the largest heading?",
    options: ["<h1>", "<h2>", "<h3>", "<header>"],
    correctAnswer: 0,
    explanation: "The `<h1>` tag defines the largest and most important heading."
  },
  {
    question: "What does the `<!DOCTYPE html>` declaration do?",
    options: ["Links to a stylesheet", "Declares the document as HTML5", "Creates a comment", "Defines a meta tag"],
    correctAnswer: 1,
    explanation: "`<!DOCTYPE html>` tells browsers the document is HTML5, ensuring proper rendering."
  },
  // CSS Questions
  {
    question: "What property sets the background color of an element?",
    options: ["color", "background-color", "bg-color", "fill"],
    correctAnswer: 1,
    explanation: "The `background-color` property sets the background color of an element."
  },
  {
    question: "How do you center an element horizontally using CSS?",
    options: ["text-align: center;", "margin: auto;", "float: center;", "position: center;"],
    correctAnswer: 1,
    explanation: "`margin: auto;` centers a block element horizontally when combined with a set width."
  },
  {
    question: "What does the `z-index` property control?",
    options: ["Font size", "Stacking order of elements", "Element opacity", "Border thickness"],
    correctAnswer: 1,
    explanation: "`z-index` controls the stacking order of positioned elements; higher values appear on top."
  },
  {
    question: "What is the difference between `relative` and `absolute` positioning?",
    options: ["Relative is fixed to the viewport", "Absolute is relative to the nearest positioned ancestor", "Relative ignores parent elements", "Absolute stays in normal flow"],
    correctAnswer: 1,
    explanation: "`relative` positions relative to its normal position; `absolute` is relative to the nearest positioned ancestor."
  },
  {
    question: "How can you apply styles to an element on hover?",
    options: [":hover{}", ".hover{}", "#hover{}", "hover:style{}"],
    correctAnswer: 0,
    explanation: "The `:hover` pseudo-class applies styles when the mouse hovers over an element."
  },
  // JavaScript Questions
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: ["variable x = 10;", "let x = 10;", "x = 10;", "const x: 10;"],
    correctAnswer: 1,
    explanation: "`let` declares a block-scoped variable in JavaScript."
  },
  {
    question: "What does the `addEventListener` method do?",
    options: ["Changes element styles", "Adds a new HTML element", "Attaches an event handler to an element", "Removes an event"],
    correctAnswer: 2,
    explanation: "`addEventListener` attaches an event handler (e.g., click) to an element without overwriting existing handlers."
  },
  {
    question: "How do you access the first element of an array in JavaScript?",
    options: ["array[0]", "array.first()", "array[1]", "array.get(0)"],
    correctAnswer: 0,
    explanation: "Arrays are zero-indexed, so `array[0]` accesses the first element."
  },
  {
    question: "What is the purpose of the `return` statement in a function?",
    options: ["Stops the function execution", "Outputs a value from the function", "Declares a variable", "Loops through code"],
    correctAnswer: 1,
    explanation: "The `return` statement outputs a value and stops the function's execution."
  },
  {
    question: "What does `===` compare in JavaScript?",
    options: ["Value only", "Type only", "Value and type", "Reference only"],
    correctAnswer: 2,
    explanation: "`===` checks for equality in both value and type without type coercion."
  }
];

let currentQuestion = 0;
let score = 0;
let questionsShuffled = [];
let timer;
let timeLeft = 30;

const questionEl = document.getElementById('question');
const optionsEl = document.querySelectorAll('.option');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next');
const resultsEl = document.getElementById('results');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const currentEl = document.getElementById('current');
const quizContainer = document.querySelector('.quiz-container');
const timerEl = document.querySelector('.timer');

// Shuffle questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startQuiz() {
  questionsShuffled = shuffle([...questions]);
  currentQuestion = 0;
  score = 0;
  quizContainer.style.display = 'block';
  resultsEl.classList.remove('show');
  resetTimer();
  loadQuestion();
}

function loadQuestion() {
  const q = questionsShuffled[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.forEach((btn, i) => {
    btn.textContent = q.options[i];
    btn.classList.remove('correct', 'incorrect');
    btn.disabled = false;
    btn.setAttribute('aria-label', `Option ${i + 1}: ${q.options[i]}`);
  });
  feedbackEl.textContent = '';
  nextBtn.disabled = true;
  currentEl.textContent = currentQuestion + 1;
  quizContainer.style.animation = 'fadeIn 0.5s ease-in';
  resetTimer();
  startTimer();
}

function checkAnswer(selected) {
  const q = questionsShuffled[currentQuestion];
  optionsEl.forEach(btn => btn.disabled = true);
  stopTimer();
  if (selected === q.correctAnswer) {
    optionsEl[selected].classList.add('correct');
    score++;
    feedbackEl.textContent = `Correct! ${q.explanation}`;
  } else {
    optionsEl[selected].classList.add('incorrect');
    optionsEl[q.correctAnswer].classList.add('correct');
    feedbackEl.textContent = `Incorrect. ${q.explanation}`;
  }
  nextBtn.disabled = false;
}

optionsEl.forEach((btn, i) => {
  btn.addEventListener('click', () => checkAnswer(i));
});

nextBtn.addEventListener('click', () => {
  stopTimer();
  currentQuestion++;
  if (currentQuestion < questionsShuffled.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

restartBtn.addEventListener('click', startQuiz);

function showResults() {
  quizContainer.style.display = 'none';
  resultsEl.classList.add('show');
  scoreEl.textContent = score;
  const percentage = (score / questionsShuffled.length) * 100;
  if (percentage >= 80) {
    messageEl.textContent = "Awesome job! You're a web dev star!";
  } else if (percentage >= 50) {
    messageEl.textContent = "Good effort! Keep practicing!";
  } else {
    messageEl.textContent = "Don't give up! Try again to boost your score!";
  }
  stopTimer();
}
  
function startTimer() {
  console.log('Timer started');
  timer = setInterval(() => {
    timeLeft--;
    console.log('Timer tick:', timeLeft);
    timerEl.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      console.log('Timer ended');
      feedbackEl.textContent = "Time's up! Moving to next question.";
      optionsEl.forEach(btn => btn.disabled = true);
      optionsEl[questionsShuffled[currentQuestion].correctAnswer].classList.add('correct');
      nextBtn.disabled = false;
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function resetTimer() {
  stopTimer();
  timeLeft = 30;
  timerEl.textContent = `Time: ${timeLeft}s`;
}

// Particle Animation for Futuristic Background
const canvas = document.querySelector('.background-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.2 - 0.1;
    this.speedY = Math.random() * 0.2 - 0.1;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

initParticles();
animateParticles();

startQuiz();
