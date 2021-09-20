/*
  Globals
*/
let enterSendsToNextPage = gotEverythingCorrect();

/*
  Needed Dom Elements
*/
let aTags = [...document.getElementsByTagName("a")];

/* 
  Remove Default Form Submission Behavior
*/
let problemForm = document.getElementById("problemMainForm");
problemForm.removeAttribute("action");
problemForm.removeAttribute("onsubmit");

/*
  Typing Behavior
*/
let inputFields = [...document.getElementsByTagName("input")];

inputFields.map(el => {
  if (el.type === "hidden") return;
  el.addEventListener("input", function() {
    typingAnswer(el);
  });
});

function typingAnswer(el) {
  enterSendsToNextPage = false;
  updatePreviews();
}

/*
  Keybinds
*/
document.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    if (enterSendsToNextPage) {
      searchInnerText(aTags, "Next Problem").click();
    } else {
      document.getElementById("submitAnswers_id").click();
    }
  }

  // TODO: Allow typing of N and B within textboxes
  //  (can use tellIfLikelyTyping function below)
  //  I am not adding this now, because I don't need to type N and B
  if (event.key == "N" && event.shiftKey) {
    searchInnerText(aTags, "Next Problem").click();
  }
  if (event.key == "B" && event.shiftKey) {
    searchInnerText(aTags, "Previous Problem").click();
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

function gotEverythingCorrect() {
  let attemptResultsSummaryDivs = document.getElementsByClassName("attemptResultsSummary");
  if (attemptResultsSummaryDivs.length == 0) return false;
  return attemptResultsSummaryDivs[0].children[0].className === "ResultsWithoutError";
}
