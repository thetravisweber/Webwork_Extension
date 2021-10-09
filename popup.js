document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("study_problem_button").addEventListener('click', onclick, false);
  const openRandomProblemMessage = 'open_random_problem';
  
  function onclick () {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, openRandomProblemMessage);
    });
  }
}, false)

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("webwork_link").addEventListener('click', onclick, false);
  const WEBWORK_URL = "https://webwork.asu.edu";
  
  function onclick () {
    window.open(WEBWORK_URL, '_blank');  
  }
}, false)

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("info-btn").addEventListener('click', onclick, false);
  var infoIsOpen = false;
  var infoBox = document.getElementById('readme-frame');
  function onclick () {
    if (infoIsOpen) {
      infoBox.setAttribute('hidden', 'true');
    } else {
      infoBox.removeAttribute('hidden');
    }
    infoIsOpen = !infoIsOpen;
  }
}, false)



function addToDoc(msg) {
  document.getElementById('set-box').innerText += msg;
}

window.addEventListener('DOMContentLoaded', function () {

  chrome.storage.sync.get(['webwork_classes'], (e) => {
      parseClasses(e.webwork_classes.classes);
  });
  
  function parseClasses(classes) {

    let sets = [];
    for(let i = 0; i < classes.length; i++) {
      for (let j = 0; j < classes[i].sets.length; j++) {
        sets.push(classes[i].sets[j]);
      }
    }

    const MAX_SETS = 6;
    sets = sortSets(sets, MAX_SETS);
    for (let i = 0; i < MAX_SETS && i < sets.length; i++) {
      addSetText(sets[i]);
    }

  }

  function sortSets(sets, maxSets) {
    let sortedSets = [];
    const MAX_LENGTH = Math.min(maxSets,sets.length);

    for (let i = 0; i < MAX_LENGTH; i++) {
      let closest = Infinity;
      let closestIndex = -1;
      for (let j = 0; j < sets.length; j++) {
        let timezoneOffset = new Date().getTimezoneOffset();
        let timezoneSign = Math.sign(timezoneOffset) < 0 ? '+' : '-';
        timezoneOffset = Math.abs(timezoneOffset);
        let offsetHours = Math.floor(timezoneOffset / 60);
        let offsetMinutes = timezoneOffset % 60;
        if (offsetHours < 10) {
          offsetHours = '0' + offsetHours;
        }
        if (offsetMinutes < 10) {
          offsetMinutes = '0' + offsetMinutes;
        }
        let timezone = 'GMT' + timezoneSign + offsetHours + ':' + offsetMinutes;
        let setDueText = sets[j].due + ' 23:59:59 ' + timezone;
        let setDue = new Date(setDueText);
        let timeTil = setDue.getTime() - Date.now();

        if (timeTil > 0 && timeTil < closest) {
          closestIndex = j;
          closest = timeTil;
        }
      }
      closestIndex >= 0 && sortedSets.push(sets[closestIndex]);
      sets.splice(closestIndex, 1)

    }
    return sortedSets;
  }

  function addSetText(set) {
    let setElement = document.createElement('button');
    setElement.className = 'set-text';
    if (isDueToday(set.due + ' 23:59:59 MST')) {
      setElement.className = setElement.className + ' due-today'
    }

    let setDueText = set.due.substring(0, 5);
    setElement.innerText = setDueText + ' : ' + set.name;

    setElement.addEventListener('click', onclick, false);
    
    function onclick () {
      window.open(set.link, '_blank');  
    }

    let setBox = document.getElementById('set-box');
    setBox.append(setElement);
  }

  function isDueToday(setDue) {
    let dueDate = new Date(setDue);
    const today = new Date();
    return dueDate.getDate() == today.getDate() &&
      dueDate.getMonth() == today.getMonth() &&
      dueDate.getFullYear() == today.getFullYear();
  }

}, false)

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("print-btn").addEventListener('click', onclick, false);

  function onclick() {
    printWebworkClasses();
  }

}, false)

function printWebworkClasses() {
  chrome.storage.sync.get(['webwork_classes'], (e) => {
      console.log(e);
  });
}