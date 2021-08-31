/*
  Needed Dom Elements
*/
let problemForm = document.getElementById("problemMainForm");
let submitButton = document.getElementById("submitAnswers_id");

/* 
  Remove Default Form Submission Behavior
*/
let defaultAction = problemForm.getAttribute("action");
problemForm.removeAttribute("action");
problemForm.removeAttribute("onsubmit");

/*
  Add in Wanter Event Handlers
*/
document.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    submitButton.click();
  }
});