//define elements
const nav = document.body.querySelector("nav");
const container = document.getElementById("container");
const alert = document.getElementById("alert");
const viewScores = document.querySelector("a");
const title = document.querySelector("h1");
const start = document.createElement("button");
const quiz = document.getElementById("quiz");
const inform = document.getElementById("inform");
const time = document.getElementById("time");

//variables

const alertStyle = alert.style;
const navStyle = nav.style;
const containerStyle = container.style;
const startStyle = start.style;
const quizStyle = quiz.style;
const black = "#000000";
const white = "#ffffff"; 
const purple = "#3e0b57";
const purpleMouse = "#d49cf0";
const answerArr = []


let score = 0;
let fadeOut;
let currScore;
let timeBonus;
let ind;
let timeLeft = 100;
let timer;
let choices = [];
let question;
let answer;
let ol;

//Questions paired with answers
const questions = [
  ["!DOCTYPE __________ is primarily used to structure a web page.", "HTML"],
  ["What symbol is used to designate an Id?", "#"],
  ["What file type is typically used to style a website", "CSS"],
  ["What symbol is used to designate a Class", "."],
  ["What is the world's most popular programming language.", "JavaScript"],
  
];

//body style
document.body.style.margin = "0";
document.body.style.backgroundColor = white;

//Title style
title.style.color = black;


//navbar stle
navStyle.display = "flex";
navStyle.justifyContent = "space-between";
navStyle.padding = "25px";
navStyle.backgroundColor = white;
navStyle.color = purple;
navStyle.fontSize = "18pt";

//highscores
viewScores.style.textDecoration = "none";
viewScores.style.color = purple;
viewScores.onmouseover = () => (viewScores.style.color = purpleMouse);
viewScores.onmouseout = () => (viewScores.style.color = purple);

//show highscores
const showScores = () => {
  quiz.innerHTML = "";
  const highScores = JSON.parse(localStorage.getItem("highScores"));
  
  const h2 = document.createElement("h2");
  if (!highScores) {
    h2.textContent = "Scores not yet available."
    quiz.append(h2)
    quiz.append(start)
    return
  }
  h2.textContent = "Highscores";
  quiz.append(h2);
  const entries = Object.entries(highScores);
  entries.sort((a, b) => { 
    return b[1] - a[1];
  });

  //builds scoreboard
  entries.forEach((entry, i) => { 
    const thisScore = entry[1];
    const thisName = entry[0];
    const span = document.createElement("span");
    span.textContent = `${i + 1}. ${thisName}: ${thisScore}`;
    if (i % 2 === 0) span.style.backgroundColor = purple;
    span.style.padding = "5px";
    span.style.fontWeight = "bold";
    start.onclick = () => location.reload();
    quiz.append(span);
    quiz.append(start);
  });
};

//container stlye
containerStyle.display = "flex";
containerStyle.flexFlow = "column wrap";
containerStyle.alignItems = "center";
containerStyle.marginTop = "20px";

//quiz dialogue
quizStyle.display = "flex";
quizStyle.flexFlow = "column wrap";
quizStyle.padding = "20px";
quizStyle.width = "500px";
quizStyle.backgroundColor = white;
quizStyle.color = black;


//alert box
alert.width = "100px";
alertStyle.position = "absolute";
alertStyle.top = "25px";
alertStyle.display = "none";
alertStyle.color = "black";

time.textContent = timeLeft;

//start button style
start.textContent = "Start Quiz";
startStyle.backgroundColor = purple;
startStyle.color = white;
startStyle.borderRadius = "5px";
startStyle.marginTop = "0px";
startStyle.width = "100px";
start.classList.add("choice");



viewScores.onclick = showScores;

//Answer array
questions.forEach((q) => {
  answerArr.push(q[1])
})

//Initial dialogue
const startPrompt = () => {
  quiz.innerHTML = "";
  const intro = document.createElement("h3");
  intro.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by 10 seconds!";
  quiz.append(intro);
  const scoring = document.createElement("p");
  scoring.style.fontSize = '15pt'
  start.onclick = startQuiz;
  quiz.append(scoring);
  quiz.append(start);
  addListeners();
};

//initiate quiz
const startQuiz = () => {
  startTimer();
  generateQuestion();
  const scoreCard = document.createElement("section");
  const scoreCardStyle = scoreCard.style;
  scoreCard.innerHTML = `<h1>Score:</h1> <span id=currScore>${score}</span>`;
  scoreCardStyle.marginTop = "10px";
  scoreCardStyle.color = black;
  scoreCardStyle.textAlign = "center";
  container.append(scoreCard);
  currScore = document.getElementById("currScore");
  currScore.style.fontSize = "18pt";
  timeBonus = timeLeft * 100;
  currScore.textContent = score + timeBonus;
};

//countdown and calculate score
const startTimer = () => {
  timer = setInterval(() => {
    timeLeft--;
    time.textContent = timeLeft;
    timeBonus = timeLeft * 100;
    currScore.textContent = score + timeBonus;
    if (timeLeft <= 0) {
      clearInterval(timer);
      recordScore();
    }
  }, 1000);
};

//create question variables and remove choices
const generateQuestion = () => {
  quiz.innerHTML = "";
  const choiceArr = [...answerArr];
  const questArr = randomQuestion(questions);
  question = questArr[0];
  answer = questArr[1];
  choices = [];
  questions.splice(ind, 1);
  for (let i = 0; i < 4; i++) { 
    let index =
      i == 0
        ? choiceArr.indexOf(answer)
        : (Math.random() * choiceArr.length) << 0;
    choices.push(choiceArr[index]);
    choiceArr.splice(index, 1);
  }

  addQuestion();
};

//get a random question
const randomQuestion = (questions) => {
  ind = (questions.length * Math.random()) << 0;
  return questions[ind];
};

//add question and choices to dialogue
const addQuestion = () => {
  const h3 = document.createElement("h3");
  quiz.append(h3);
  h3.textContent = question;
  h3.style.wordBreak = "word";
  for (let i = 0; i < 4; i++) {
    const index = (Math.random() * choices.length) << 0;
    const choice = choices[index];
    const btn = document.createElement("button");
    const buttonStyle = btn.style;
    buttonStyle.marginTop = "10px";
    buttonStyle.padding = "5px";
    buttonStyle.borderRadius = "6px";
    buttonStyle.color = white;
    buttonStyle.backgroundColor = purple;
    buttonStyle.width = "200px";
    buttonStyle.textAlign = "left";
    btn.classList.add("choice");
    btn.textContent = `${i + 1}. ${choice}`;
    quiz.append(btn);
    choices.splice(index, 1);
  }
};

//request initials and store high score
const recordScore = () => {
  const myScore = currScore.textContent;
  let highScores = JSON.parse(localStorage.getItem("highScores"));
  const form = document.createElement("form");
  const initials = document.createElement("input");
  const submit = document.createElement("input");
  const label = document.createElement("label");
  const initialsStyle = initials.style;
  const sStyl = submit.style;

  clearInterval(timer);
  quiz.innerHTML = "";

  //name input
  initials.type = "text";
  initials.name = "initials";
  initials.id = "initials";
  initialsStyle.display = "block";
  initialsStyle.margin = "10px";
  initialsStyle.borderRadius = "5px";
  initialsStyle.backgroundColor = white;
  initialsStyle.padding = "5px";

  //name label
  label.for = "initials";
  label.textContent = "Enter Name:";
  label.style.display = "block";
  label.style.margin = "5px";
  label.style.fontWeight = "bold";
  submit.type = "submit";
  submit.value = "Submit Score";

  //submit button
  sStyl.display = "block";
  sStyl.margin = "5px";
  sStyl.padding = "5px";
  sStyl.borderRadius = "6px";
  sStyl.color = white;
  sStyl.backgroundColor = purple;
  sStyl.textAlign = "left";
  submit.classList.add("choice");

  quiz.append(form);
  form.append(label);
  form.append(initials);
  form.append(submit);

  submit.onclick = (e) => {
    e.preventDefault();
    const name = document.getElementById("initials").value;
    if (!name) { 
      alert.width = '250px'
      showAlert("Enter Name");
      recordScore();
      return;
    }
    if (!!highScores) {
      if (highScores[name] > myScore) { 
        showScores();
        return;
      }
      highScores[name] = myScore;
      localStorage.setItem("highScores", JSON.stringify(highScores));
    } else {
      highScores = {};
      highScores[name] = myScore;
      localStorage.setItem("highScores", JSON.stringify(highScores));
    }
    showScores();
  };
};
 //Event listeners
const addListeners = () => {
  quiz.onmouseover = (e) => {
    if (e.target.classList[0] !== "choice") return;
    const styl = e.target.style;
    styl.backgroundColor = purpleMouse;
    styl.color = "white";
  };

  quiz.onmouseout = (e) => {
    if (e.target.classList[0] !== "choice") return;
    const styl = e.target.style;
    styl.backgroundColor = purple;
    styl.color = "white";
  };

  quiz.onclick = (e) => {
    const tgt = e.target;
    if (
      tgt.classList[0] !== "choice" ||
      tgt.textContent === "Start Quiz" ||
      tgt.value === "Submit Score"
    )
      return;
    if (tgt.textContent.indexOf(answer) > -1) {
      score += 100;
      showAlert("Correct!");
    } else {
      showAlert("Incorrect!");
      timeLeft -= 10;
      time.textContent = timeLeft <= 0 ? 0 : timeLeft;
    }
    if (timeLeft <= 0) {
      clearInterval(timer);
      recordScore();
      return
    }
    if (questions.length > 0) generateQuestion();
    else recordScore();
  };

  quiz.onmousedown = (e) => {
    const tgt = e.target;
    if (tgt.classList[0] !== "choice") return;
  };
};

//calculate alert position
const alertPos = (w) => {
  w = Number(w.substring(0, w.indexOf('p')))
  vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  return (vw / 2) - (w/2) + "px";
};

//show alert
const showAlert = (message, color) => {
  alertStyle.left = alertPos(alert.width);
  alertStyle.border = `1px solid ${color}`;
  alertStyle.backgroundColor = `light${color}`;
  alert.textContent = message;
  alertStyle.display = "";
  if (!!fadeOut) clearTimeout(fadeOut);
  fadeOut = setTimeout(() => {
    alertStyle.display = "none";
  }, 3000);
};


startPrompt();