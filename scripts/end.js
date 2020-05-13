const scoreTotal = document.getElementById("scoreTotal");
const latestScore = localStorage.getItem("latestScore");

scoreTotal.innerHTML = latestScore;

