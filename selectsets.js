let table = document.getElementsByClassName("problem_set_table")[0];

if (!!table) insertSelectStudySetsCheckBoxes(table);


let studySetsData = new Object();

function insertSelectStudySetsCheckBoxes(table) {
  [...table.children[1].children].forEach((row, index) => {
    if (index == 0) {
      child = selectSetsTableHeader();
    } else {
      child = createStudySetCheckBox(row, index);
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

function createStudySetCheckBox(row, index) {
  checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  let fullLink = row.children[1].children[0].href
  checkbox.setAttribute("set-link", fullLink.split("?")[0]);
  checkbox.setAttribute("index", index);
  checkbox.addEventListener("click", boxClicked);
  return checkbox;
}

function boxClicked(e) {
  let box = e.target;
  let index = box.getAttribute("index");
  if (box.checked) {
    studySetsData[index] = box.getAttribute("set-link");
  } else {
    delete studySetsData[index];
  }
  console.log(studySetsData)
}