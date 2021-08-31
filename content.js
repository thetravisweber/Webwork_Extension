/*
  Needed Dom Elements
*/
let problemForm = document.getElementById("problemMainForm");
let submitButton = document.getElementById("submitAnswers_id");
let aTags = [...document.getElementsByTagName("a")];
let nextProblemButton = searchInnerText(aTags, "Next Problem");
let lastProblemButton = searchInnerText(aTags, "Previous Problem");
// literally probably won't ever need this
if (!!submitButton) {
  submitButton = searchInnerText(aTags, "Submit Answers");
}

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
  if (event.shiftKey) {
    if (event.key == "N") {
      nextProblemButton.click();
    }
    if (event.key == "B") {
      lastProblemButton.click();
    }
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