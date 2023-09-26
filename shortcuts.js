
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
  if (!event.shiftKey) return;

  switch (event.key) {
    case 'N' :  // Next Problem
      searchInnerText(aTags, "Next Problem").click();
      break;
    case 'B' :  // Previous Problem
      searchInnerText(aTags, "Previous Problem").click();
      break;
    case 'R' :  // Random Problem
      randomProblemForWebworkAsu();
      break;
  }
  
});

