/* 
  Inject Functions.js
*/
let s = document.createElement('script');
s.src = chrome.runtime.getURL('functions.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

/* 
  Remove Default Form Submission Behavior
*/
let problemForm = document.getElementById("problemMainForm");
let submitButton = document.getElementById("submitAnswers_id");

let defaultAction = problemForm.getAttribute("action");
problemForm.removeAttribute("action");
problemForm.removeAttribute("onsubmit");


document.addEventListener('keydown', function(event) {
  if (event.key == 'Enter') {
    event.preventDefault();
    submitButton.click();
  }
});