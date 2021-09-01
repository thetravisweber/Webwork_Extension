/*
  Needed Dom Elements
*/
let problemForm = document.getElementById("problemMainForm");
let submitButton = document.getElementById("submitAnswers_id");
let aTags = [...document.getElementsByTagName("a")];
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
document.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    submitButton.click();
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

function tellIfLikelyTyping(event) {
  return event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLInputElement;
}