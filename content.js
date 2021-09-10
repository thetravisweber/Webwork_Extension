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
let problemBody = document.getElementById("problem_body");

let submitButton = document.getElementById("submitAnswers_id");
let previewButton = document.getElementById("previewAnswers_id");
let nextProblemButton = searchInnerText(aTags, "Next Problem");
let lastProblemButton = searchInnerText(aTags, "Previous Problem");

let previewTable = document.getElementsByClassName("attemptResults")[0];

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
  console.log("rocking it");
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

function gotEverythingCorrect() {
  let attemptResultsSummaryDivs = document.getElementsByClassName("attemptResultsSummary");
  if (attemptResultsSummaryDivs.length == 0) return false;
  return attemptResultsSummaryDivs[0].children[0].className === "ResultsWithoutError";
}

async function updatePreviews() {
  let newPreviewTable = await fetchPreviewText();
  if (!previewTable) {
    addPreviewTable();
  }
  previewTable.innerHTML = dropOuterTags(newPreviewTable);
}

function addPreviewTable() {
  problemBody.innerHTML = templePreviewTable() + problemBody.innerHTML;
  previewTable = document.getElementsByClassName("attemptResults")[0];
}

function templePreviewTable() {
  return `<table class="attemptResults table table-condensed table-bordered"><tbody></tbody></table>`
}

function dropOuterTags(str) {
  let x = str.split(">");
  x.shift();
  let a = x.join(">").split("<");
  a.pop();
  return a.join("<");
}

async function fetchPreviewText() {
  let rawResponse = await post("", postableFormData());
  let previewTable = parseForPreviewTable(rawResponse);
  return previewTable;
}

function parseForPreviewTable(str) {
  return substring(str, `<table class="attemptResults`, `</table>`);
}

function substring(str, start, end, inclusive = true) {
  let afterStart = str.split(start)[1];
  let betweenNonInclusive = afterStart.split(end)[0];
  if (!inclusive) return betweenNonInclusive;
  return start + betweenNonInclusive + end;
}

function postableFormData() {
  let formData = new FormData(problemForm);
  formData.append(previewButton.name, previewButton.value);
  return formData;
}

function post(url, data) {
  return new Promise((res, rej) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4)
          if (xhr.status == 200)
              res(xhr.responseText)
          else
              rej({ code: xhr.status, text: xhr.responseText })
    }
    xhr.open("POST", url);
    return xhr.send(data);
  });
}

// just a test function that I leave in because I use it a lot
function sayHi() {
  console.log("heyo");
}