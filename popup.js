document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("study-problem-button").addEventListener('click', onclick, false);
  const openRandomProblemMessage = 'open_random_problem';
  
  function onclick () {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, openRandomProblemMessage);
    });
  }
}, false)

document.addEventListener('DOMContentLoaded', function () {
  let webworkUrl;
  chrome.storage.sync.get(['webwork_data'], (data) => {
    if (data.webwork_data.webwork_home_link_set) {
      webworkUrl = data.webwork_data.webwork_home_link;
      document.getElementById("webwork-btn").addEventListener('click', onclick, false);
    } else {
      hideWebworkBtn();
      appendSetWebworkLinkPopup(data.webwork_data.webwork_home_link);
    }
  });
  function onclick () {
    window.open(webworkUrl, '_blank');  
  }

  function appendSetWebworkLinkPopup(links) {
    let linkPopup = document.createElement('linkpopup');
    linkPopup.id = 'link-popup';
    linkPopup.innerText = 'Please enter your WeBWorK Home Link';
    links.forEach(link => {
      let linkBtn = document.createElement('button');
      linkBtn.className = 'webwork-btn block-btn link-btn';
      linkBtn.innerText = link;
      linkBtn.addEventListener('click', function() {
        processPopup(link);
      });
      linkPopup.append(linkBtn);
    });
    let linkInputBox = document.createElement('inputbox');
    let linkInput = document.createElement('input');
    linkInput.type = 'textbox';
    linkInput.placeholder = 'webwork.---.edu';
    linkInputBox.append(linkInput);
    let linkSubmit = document.createElement('button');
    linkSubmit.innerText = 'Submit';
    linkSubmit.addEventListener('click', function() {
      processPopup(linkInput.value);
    });
    linkInputBox.append(linkSubmit);
    linkPopup.append(linkInputBox);
    document.getElementById('set-box').prepend(linkPopup);
  }
  
  function processPopup(link) {
    if (link) {
      removePopup();
      webworkUrl = processUrl(link);
      chrome.storage.sync.get(['webwork_data'], (data) => {
        data.webwork_data.webwork_home_link_set = true;
        data.webwork_data.webwork_home_link = webworkUrl;
        chrome.storage.sync.set(data, function() {
          location.reload();
        });
      });
    }
  }

  function processUrl(link) {
    if (link.includes('http://')) {
      return;
    }
    if (link.includes('https://')) {
      return;
    }
    link = 'https://' + link;
    return link;
  }

  function hideWebworkBtn() {
    let webworkBtn = document.getElementById('webwork-btn');
    webworkBtn.style.display = 'none';
  }

  function removePopup() {
    let linkPopup = document.getElementById('link-popup');
    linkPopup.remove();
  }

}, false)


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("info-btn").addEventListener('click', toggleInfoBox, false);
  var infoIsOpen = false;
  var infoBox = document.getElementById('info-box');
  var dataList = document.getElementById('data-list');
  var infoList = document.getElementById('info-list');
  var githubLink = document.getElementById('github-link');

  githubLink.onclick = () => {
    openLink('https://github.com/jamesweber7/Webwork_Extension');
  }

  function toggleInfoBox () {
    if (infoIsOpen) {
      infoBox.style.display = 'none';
      closeData();
    } else {
      infoBox.style.display = 'block';
      openData();
    }
    infoIsOpen = !infoIsOpen;
  }

  function openData() {
    loadDataList();
  }

  function closeData() {
    while(dataList.firstChild) {
      dataList.firstChild.remove();
    }
  }

  function loadDataList() {
    dataList.innerText = 'loading data...';
    chrome.storage.sync.get(['webwork_data'], (data) => {
      dataList.innerText = 'My Data';
      let classDataBox = getClassList(data.webwork_data.classes);
      let webworkLinkDataBox = getWebworkLinkItem(data.webwork_data);
      let resetDataButton = getResetDataButton();
      dataList.append(classDataBox);
      dataList.append(webworkLinkDataBox);
      dataList.append(resetDataButton);
    });
  }

  function getClassList(classes) {
    let numClasses = classes.length;
    let classListItem = document.createElement('li');
    let classList = document.createElement('ol');
    let classListHeader = document.createElement('lh');
    classListHeader.innerText = numClasses ? numClasses + ' class' + (numClasses > 1 ? 'es :' : ' :') : 'no classes ';
    classList.prepend(classListHeader);
    classes.forEach(classData => {
      let classItem = document.createElement('li');
      let classLink = document.createElement('a');
      classLink.addEventListener('click', function() {
        openLink(classData.link);
      });
      classLink.innerText = classData.name;
      classItem.append(classLink);
      classList.append(classItem);
    });
    classListItem.append(classList);
    return classListItem;
  }

  function getWebworkLinkItem(data) {
    let webworkLinkBox = document.createElement('li');
    webworkLinkBox.innerText = 'webwork home link: ';
    if (data.webwork_home_link_set) {
      let webworkLinkElement = document.createElement('a');
      webworkLinkElement.addEventListener('click', function() {
        openLink(data.webwork_home_link);
      });
      webworkLinkElement.innerText = data.webwork_home_link;
      webworkLinkBox.append(webworkLinkElement);
    } else {
      webworkLinkBox.innerText += 'unset';
    }
    return webworkLinkBox;
  }

  function getResetDataButton() {
    let btn = document.createElement('button');
    btn.innerText = 'Reset Data';
    btn.className = 'webwork-btn auto-btn';
    btn.addEventListener('click', resetData);
    return btn;
    function resetData() {
      chrome.storage.sync.set(getDefaultData(), function() {
        location.reload();
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
  }

  function openLink(link) {
    window.open(link, '_blank');  
  }

}, false)



function addToDoc(msg) {
  document.getElementById('set-box').innerText += msg;
}

window.addEventListener('DOMContentLoaded', function () {

  chrome.storage.sync.get(['webwork_data'], (data) => {
      parseClasses(data.webwork_data.classes);
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
