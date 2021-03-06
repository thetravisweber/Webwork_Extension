/*
  Globals
*/
let enterSendsToNextPage = gotEverythingCorrect();

/*
  Needed Dom Elements
*/
let aTags = [...document.getElementsByTagName("a")];
let submitButton = document.getElementById("submitAnswers_id");
if (!submitButton) submitButton = document.getElementById("checkAnswers_id");

/* 
  Remove Default Form Submission Behavior
*/
let problemForm = document.getElementById("problemMainForm");
problemForm.removeAttribute("action");
problemForm.removeAttribute("onsubmit");

/*
  Keybinds
*/
document.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    if (enterSendsToNextPage) {
      searchInnerText(aTags, "Next Problem").click();
    } else {
      submitButton.click();
    }
  }

  if (isLikelyTyping(event)) return;
  if (event.key == "N") {
    searchInnerText(aTags, "Next Problem").click();
  } else if (event.key == "B") {
    searchInnerText(aTags, "Previous Problem").click();
  }
});

/*
  Add in Random Problem Button
*/
addRandomProblemButton();

function addRandomProblemButton() {
  let problemNav = document.getElementById("problem-nav");
  problemNav.insertBefore(makeRandomProblemButton(), problemNav.children[problemNav.children.length-1]);
}

function makeRandomProblemButton() {
  problemListButton = searchInnerText(aTags, "Problem List");
  newButton = problemListButton.cloneNode();
  newButton.removeAttribute("href");
  newButton.addEventListener('click', navToRandomProblem);
  newButton.innerHTML = "Random Problem";
  newButton.style = "margin-right:4px";
  return newButton;
}

function navToRandomProblem() {
  let problemList = document.getElementsByClassName("problem-list")[0];
  let clickableProblemLinks = [...problemList.children].filter(el => {
    return el.tagName == "LI";
  }).map(el => {
    return el.children[0];
  });
  let randomLink = clickableProblemLinks[Math.floor(Math.random()*clickableProblemLinks.length)];
  randomLink.click();
}


/*
  Helper Functions
*/
function searchInnerText(elements, searchText) {
  return elements.find((el) => {
    return el.innerHTML == searchText;
  });
}

function isLikelyTyping(event) {
  return event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLInputElement;
}

function gotEverythingCorrect() {
  let attemptResultsSummaryDivs = document.getElementsByClassName("attemptResultsSummary");
  if (attemptResultsSummaryDivs.length == 0) return false;
  return attemptResultsSummaryDivs[0].children[0].className === "ResultsWithoutError";
}
