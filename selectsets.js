let table = document.getElementsByClassName("problem_set_table")[0];
let firstLandKey = getCourse()+"_firstland";
let studySetsKey = getCourse()+"_studysets"

if (!!table) {
  chrome.storage.sync.get({firstLandKey : true}, function(is_first_land) {
    chrome.storage.sync.get([studySetsKey], function(studySets) {
      insertSelectStudySetsCheckBoxes(table, studySets[studySetsKey], is_first_land);
    });
  });
}


// chrome.storage.sync.set({key: value}, function() {
//   console.log('Value is set to ' + value);
// });

// chrome.storage.sync.get(['key'], function(result) {
//   console.log('Value currently is ' + result.key);
// });

function insertSelectStudySetsCheckBoxes(table, studySets, is_first_land) {
  [...table.children[1].children].forEach((row, index) => {
    if (index == 0) {
      child = selectSetsTableHeader();
    } else {
      child = createStudySetCheckBox(row, index, (!!studySets[index]));
    }
    // insert new cell at end of row, and put the child element inside
    let x = row.insertCell(-1);
    x.appendChild(child);
  });
}

function selectSetsTableHeader() {
  head = document.createElement("span");
  head.innerHTML = "Study";
  return head;
}

function createStudySetCheckBox(row, index, isChecked) {
  checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  let fullLink = row.children[1].children[0].href;
  checkbox.setAttribute("set-link", fullLink.split("?")[0]);
  checkbox.setAttribute("index", index);
  if (isChecked) {
    checkbox.setAttribute("checked", null);
  }
  checkbox.addEventListener("click", boxClicked);
  return checkbox;
}

function boxClicked(e) {
  chrome.storage.sync.get({[studySetsKey]: {}}, function(studySetsData) {
    let box = e.target;
    let index = box.getAttribute("index");
    if (box.checked) {
      studySetsData[studySetsKey][index] = box.getAttribute("set-link");
    } else {
      delete studySetsData[studySetsKey][index];
    }
    chrome.storage.sync.set(studySetsData);
  });
}

function getCourse() {
  // works for NAU, idk about any other schools. A more robust solution is welcome
  return window.location.href.split("/")[4]
}