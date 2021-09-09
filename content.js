/*
  Globals
*/
let enterSendsToNextPage = gotEverythingCorrect();

/*
  Needed Dom Elements
*/
let inputFields = [...document.getElementsByTagName("input")];
let aTags = [...document.getElementsByTagName("a")];

let problemForm = document.getElementById("problemMainForm");
let submitButton = document.getElementById("submitAnswers_id");
let previewButton = document.getElementById("previewAnswers_id");
let nextProblemButton = searchInnerText(aTags, "Next Problem");
let lastProblemButton = searchInnerText(aTags, "Previous Problem");

/* 
  Remove Default Form Submission Behavior
*/
let defaultAction = problemForm.getAttribute("action");
problemForm.removeAttribute("action");
problemForm.removeAttribute("onsubmit");

/*
  Add in Wanted Event Handlers
*/

inputFields.map(el => {
  if (el.type === "hidden") return;
  el.addEventListener("input", function() {
    typingAnswer(el);
  });
});

function typingAnswer(el) {
  enterSendsToNextPage = false;
  console.log(el.value);
}

/*
  Keybinds
*/
document.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    if (enterSendsToNextPage) {
      nextProblemButton.click();
    } else {
      submitButton.click();
    }
  }

  // TODO: Allow typing of N and B within textboxes
  //  (can use tellIfLikelyTyping function below)
  //  I am not adding this now, because I don't need to type N and B
  if (event.key == "N" && event.shiftKey) {
    nextProblemButton.click();
  }
  if (event.key == "B" && event.shiftKey) {
    lastProblemButton.click();
  }
});

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

function hasRoleAlert(element) {
  console.log(element);
  return element.role === "alert";
}

function gotEverythingCorrect() {
  let attemptResultsSummaryDivs = document.getElementsByClassName("attemptResultsSummary");
  if (!attemptResultsSummaryDivs) return false;
  return attemptResultsSummaryDivs[0].children[0].className === "ResultsWithoutError";
}

// just a test function that I leave in because I use it a lot
function sayHi() {
  console.log("heyo");
}