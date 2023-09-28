/*
  Globals
*/
var enterSendsToNextPage = gotEverythingCorrect();

/*
  Needed Dom Elements
*/
let aTags = [...document.getElementsByTagName("a")];
let submitButton = document.getElementById("submitAnswers_id");
if (!submitButton) submitButton = document.getElementById("checkAnswers_id");

setupInputProcessors();
processUrl();
styleForNumberOfAttempts();
addNavbarButtons();
giveNavbarButtonsTooltips();
practiceMode();

function setupInputProcessors() {
  // for each editable field
  [...document.getElementsByClassName("mq-editable-field")].forEach(el => {
    // listen for input
    el.addEventListener("input", function() {
      // process input
      typingAnswer(el);
    });
  });
}

function extractAnswer(el) {
  let root = el.getElementsByClassName('mq-root-block')[0];
  let chars = [...root.children];
  let input = chars.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.innerText.toString();
  }, "");
  return input.substring(0, input.length-1);
}

function typingAnswer(el) {
  enterSendsToNextPage = false;
  // uncomment if you want to try to work on the live preview
  // updatePreviews();
  let typedAnswer = extractAnswer(el);
  doNothing(typedAnswer);
}


function processUrl() {
  chrome.storage.sync.get(['webwork_data'], (data) => {
    let url = getWebworkHomeUrl(window.location.href);
    if (!Object.keys(data).length) {
      data = getDefaultData();
    }
    if (!data.webwork_data.webwork_home_link_set && !data.webwork_data.webwork_home_link.includes(url)) {
      data.webwork_data.webwork_home_link.push(url);
    }
    chrome.storage.sync.set(data);
  });
}


function getDefaultData() {
  return {
      webwork_data : {
        classes : [],
        webwork_home_link : [],
        webwork_home_link_set : false
      }
  };
}

function getWebworkHomeUrl(url) {
  let ignoreStarts = ['https://', 'http://', 'www.'];
  url = url.toLowerCase();
  for (let i = 0; i < ignoreStarts.length; i++) {
    let ignoreStart = ignoreStarts[i];
    if (url.includes(ignoreStart)) {
      url = url.substr(url.indexOf(ignoreStart) + ignoreStart.length);
    }
    if (url.includes('webwork2')) {
      url = url.replace('webwork2', 'webwork');
    }
  }

  let ignoreEnds = ['/', '?', '#', '&'];
  for (let i = 0; i < ignoreEnds.length; i++) {
    let ignoreEnd = ignoreEnds[i];
    if (url.includes(ignoreEnd)) {
      url = url.substr(0, url.indexOf(ignoreEnd));
    }
  }
  url = url.toLowerCase();
  
  return url;
}

function styleForNumberOfAttempts() {
  let attemptsLabel, attemptsText;
  attemptsLabel = document.getElementById('score_summary');
  if (attemptsLabel) {
    attemptsLabel = attemptsLabel.getElementsByTagName('p');
  }
  if (attemptsLabel.length) {
    attemptsLabel = attemptsLabel[0];
  }
  if (attemptsLabel) {
    attemptsText = attemptsLabel.innerText;
  }
  // something went wrong getting attemptsLabel
  if (!attemptsText.includes('remaining')) {
    return;
  }

  const attempts = getAttempts(attemptsText);
  // do nothing
  if (attempts == Infinity || attempts == 0) {
    return;
  } else if (attempts > 1) {
    // orange
    attemptsLabel.style = 'color: #ff5700;';
  } else {
    // last attempt - red
    attemptsLabel.style = 'color: red;';
  }
}

function getAttempts(attemptsText) {
  const index = attemptsText.lastIndexOf("\n");
  attemptsText = attemptsText.substring(index);
  attemptsText = attemptsText.replace("\nYou have ", '');
  attemptsText = attemptsText.replace(" attempts remaining.", '');
  attemptsText = attemptsText.replace(" attempt remaining.", '');
  if (attemptsText == "unlimited") {
    return Infinity;
  } else {
    return Number.parseInt(attemptsText);
  }
}

/*
 * Navbar Buttons
*/

function addNavbarButtons() {
  addRandomProblemButton();
  addPracticeModeButton();
  addSerotoninButton();
}

function addRandomProblemButton() {
  let btn = makeNavbarButton('Random Problem', navToRandomProblem);
  addNavbarButton(btn, 1  /* Add to left of next problem */);
}

function addPracticeModeButton() {
  let btn = makeNavbarButton('Practice Mode', togglePracticeMode);
  addNavbarButton(btn);

  function togglePracticeMode() {
    chrome.storage.sync.get(['webwork_data'], (data) => {
      data.webwork_data.practiceMode = !data.webwork_data.practiceMode;
      // turn on practice mode
      if (data.webwork_data.practiceMode) {
        if (confirm("You are going to enter practice mode, which will hide all entered answers, and possibly goof them up. If the entered answers are important, you should save them somehow.")) {
          chrome.storage.sync.set(data, practiceMode);
        }
      } 
      // turn off practice mode
      else {
        if (confirm("You are going to exit practice mode, which will reload the page and possibly goof up whatever answers you have entered. If the entered answers are important, you should save them somehow.")) {
          chrome.storage.sync.set(data, reloadPage);
        }
      }
    })
  }
}

function addSerotoninButton() {
  let btn = makeNavbarButton('Serotonin', serotonin);
  addNavbarButton(btn);
}

function addNavbarButton(button, posFromRight=0) {
  let problemNav = searchInnerText(aTags, "Problem List").parentElement;

  problemNav.insertBefore(button, problemNav.children[problemNav.children.length-posFromRight]);
}

function makeNavbarButton(text, onclick=null) {
  problemListButton = searchInnerText(aTags, "Problem List");
  let button = problemListButton.cloneNode();
  button.removeAttribute("href");
  button.innerHTML = text;
  button.id = text.toLowerCase().replaceAll(' ', '-');
  if (onclick) {
    button.addEventListener('click', onclick);
  }
  button.style = "margin-right:4px";
  return button;
}

function giveNavbarButtonsTooltips() {
  let problemNav = searchInnerText(aTags, "Problem List").parentElement;
  [...problemNav.children].forEach(btn => {
    switch (btn.innerText) {
      case 'Previous Problem' :
        giveTooltip(btn, 'Go Back to previous problem [shift+B]');
        break;
      case 'Problem List' :
        giveTooltip(btn, 'View problems in set');
        break;
      case 'Random Problem' :
        giveTooltip(btn, 'Go to Random problem in set [shift+R]');
        break;
      case 'Next Problem' :
        giveTooltip(btn, 'Go to Next problem [shift+N]');
        break;
      case 'Practice Mode' :
        giveTooltip(btn, 'Enter practice mode. Hide previous answers to avoid spoilers.');
        break;
      case 'Serotonin' :
        giveTooltip(btn, 'Numbers are boring. Give your brain a juicy squirt of serotonin');
        break;
    }
  });
}

function giveTooltip(btn, tooltip) {
  btn.title = tooltip;
}

/*
 * Random Problem
 */

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
 * Practice Mode
 */

function practiceMode() {
  chrome.storage.sync.get(['webwork_data'], (data) => {
    if (!data.webwork_data.practiceMode) {
      return;
    }
    // UI text warning user is in practice mode
    createPracticeModeHeader();

    // problem body - all previous will be in here
    const problemBody = document.getElementById('problem_body');

    // typed answers
    [...problemBody.getElementsByTagName('input')].forEach(input => { // check inputs for those holding value of previous answer
      if (input.name.toLowerCase().includes('answer')) {  // is previous answer
        // if search elements exist/are valid
        if (input.nextElementSibling && input.nextElementSibling.getElementsByTagName('span').length > 0) { 
          [...input.nextElementSibling.getElementsByTagName('span')].forEach(child => {
            if (child.className == 'mq-root-block') {
              child.innerText = '';
            }
          });
        }
      }
    });

    // checkbox questions
    [...problemBody.getElementsByTagName('input')].forEach(checkbox => {
      if (checkbox.type.toLowerCase() == 'checkbox') {
        checkbox.removeAttribute('checked');
      }
    });

    // radio button questions
    [...problemBody.getElementsByTagName('input')].forEach(checkbox => {
      if (checkbox.type.toLowerCase() == 'radio') {
        checkbox.removeAttribute('checked');
      }
    });

    // select questions
    [...problemBody.getElementsByTagName('option')].forEach(option => {
      option.removeAttribute('selected');
    });
  });
}

function isPracticeMode() {
  return document.getElementById('practice-mode').getAttribute('practice-mode');
}

function createPracticeModeHeader() {
  const header = document.createElement('div');
  header.id = 'practice-mode-header';
  header.style = 'color: #ff5e00;'
  header.innerText = 'You are in practice mode. Previous answers have been hidden.';

  const exitBtn = document.createElement('a');
  exitBtn.onclick = exitPracticeMode;
  exitBtn.style = 'text-decoration: underline; margin-left: 1em; cursor: pointer;';
  exitBtn.innerText = 'exit practice mode';
  header.append(exitBtn);

  let navbarParent = searchInnerText(aTags, "Problem List").parentElement.parentElement;
  navbarParent.after(header);

  function exitPracticeMode() {
    chrome.storage.sync.get(['webwork_data'], data => {
      data.webwork_data.practiceMode = false;
      if (confirm("You are going to exit practice mode, which will reload the page and possibly goof up whatever answers you have entered. If the entered answers are important, you should save them somehow.")) {
        chrome.storage.sync.set(data, reloadPage);
      }
    })
  }
}

/* 
 * Serotonin
 */

function serotonin() {

  const ms = 3000;

  // after time ends
  setTimeout(() => {
    document.body.onmousemove = null;
    // delete sp display
    spDisplay.style.transitionDuration = '1200ms';
    spDisplay.style.transform = 'scale(0%)';
    spDisplay.ontransitionend = () => {
      spDisplay.remove();
    }
  }, ms);
  
  // body colors

  // reset body animation
  document.body.style = 'animation: none';
  // back of call stack
  setTimeout(() => {
    document.body.style = `animation: rainbow ${ms}ms cubic-bezier(0.25, 0, 0.75, 1);`;
  }, 0);

  // mouse moved
  document.body.onmousemove = (e) => {
    createFunCircle(e);
    increaseSeratoninPoints(e);
  }

  // circle art
  function createFunCircle(e) {
    const div = document.createElement('div');
    div.style=`position: absolute; left: ${e.pageX}px; top: ${e.pageY}px; width: 20px; height: 20px; border-radius: 50%; animation: rainbow ${ms}ms cubic-bezier(0.25, 0, 0.75, 1);`;
    document.body.append(div);
    div.onanimationend = () => {
      div.remove();
    }
  }

  // serotonin points

  // create serotonin points popup
  let spDisplay = document.createElement('div');
  spDisplay.style = 'position: absolute; width: 100px; height: 100px; line-height: 100px; text-align: center; border-radius: 50%; display:  align-content: center; background-color: white; color: #ff008b; border: 2px solid #ff008b; z-index: 10000;';
  spDisplay.setAttribute("points", 0);
  spDisplay.innerText = "0 points";
  let navbarParent = searchInnerText(aTags, "Problem List").parentElement.parentElement;
  navbarParent.after(spDisplay);

  function increaseSeratoninPoints(e) {
    const div = document.createElement('div');
    div.style = `position: absolute; font-size: 16px; font-weight: bolder; /*left: ${e.pageX}px; top: ${e.pageY}px; */color: #019c01; animation: points-up 1000ms forwards; z-index: 10001;`;
    div.innerText = '+ 1';
    // document.body.append(div);
    spDisplay.after(div);
    div.onanimationend = () => {
      div.remove();
    }
    // increase points
    let points = spDisplay.getAttribute('points');
    points ++;
    spDisplay.setAttribute('points', points);
    spDisplay.innerText = `${points} points`;
    spDisplay.style.transform = `scale(${points + 100}%)`;
  }

  if (document.getElementById('serotonin-style')) {
    return;
  }
  // create animation
  const style = document.createElement('style');
  style.id = 'serotonin-style';
  style.innerText = `
  @keyframes rainbow {
    10% {
      background-color: red;
    }
    30% {
      background-color: yellow;
    }
    50% {
      background-color: green;
    }
    70% {
      background-color: blue;
    }
    90% {
      background-color: violet;
    }
  }
  
  @keyframes points-up {
    from {
      transform: translate(75px, 0);
      opacity: 100%;
    }
    to {
      transform: translate(75px, -200px);
      opacity: 0%;
    }
  }`;
  document.head.append(style);
}

/*
 * Helper Functions
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

// needs to be called as the direct result of a user action
// doesn't work for every page - made for individual problem page. ammend as needed for additional use cases.
function reloadPage() {
  let anchors = [...document.getElementById('breadcrumb-navigation').getElementsByTagName('a')];
  anchors[anchors.length - 1].click();
}