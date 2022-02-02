let table = document.getElementsByClassName("problem_set_table")[0];
let firstLandKey = getCourse()+"_firstland";
let studySetsKey = getCourse()+"_studysets";

// chrome.storage.sync.clear();

if (!!table) {
  chrome.storage.sync.get({[firstLandKey] : true}, function(results) {
    is_first_land = results[firstLandKey];
    if (is_first_land) {
      allStudySetsOn(table);
      chrome.storage.sync.set({[firstLandKey]: false});
    }
    chrome.storage.sync.get([studySetsKey], function(studySets) {
      insertSelectStudySetsCheckBoxes(table, studySets[studySetsKey] || studySets, is_first_land);
    });
  });
}

function insertSelectStudySetsCheckBoxes(table, studySets, is_first_land) {
  rowsOf(table).forEach((row, index) => {
    if (index == 0) {
      child = selectSetsTableHeader();
    } else {
      child = createStudySetCheckBox(row, index, (!!studySets && !!studySets[index]) || is_first_land);
    }

    // insert new cell at end of row, and put the child element inside
    let x = row.insertCell(-1);
    x.appendChild(child);
  });
}

function rowsOf(table) {
  return [...table.children[1].children]
}

function selectSetsTableHeader() {
  head = document.createElement("span");
  head.innerHTML = "Study";
  return head;
}

function rowLink(row) {
  let fullLink = row.children[1].children[0].href;
  return fullLink.split("?")[0].split(".edu")[1];
}

function createStudySetCheckBox(row, index, isChecked) {
  checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("set-link", rowLink(row));
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

function allStudySetsOn(table) {
  studySets = {};
  rowsOf(table).forEach((row, index) => {
    if (index==0) return;
    studySets[index] = rowLink(row);
  });
  chrome.storage.sync.set({[studySetsKey]: studySets});
}