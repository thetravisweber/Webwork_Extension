async function updatePreviews() {
  let newOutputSummary = await fetchOutputSummary();
  let oldOutputSummary = document.getElementById("output_summary");
  document.replaceChild(newOutputSummary, oldOutputSummary);
}

function addPreviewTable() {
  let table = document.createElement("table")
  table.className = templatePreviewTableClass();

  previewTable = getPreviewTable(document);
}

function templatePreviewTableClass() {
  return "attemptResults table table-condensed table-bordered";
}

function dropOuterTags(str) {
  let x = str.split(">");
  x.shift();
  let a = x.join(">").split("<");
  a.pop();
  return a.join("<");
}

async function fetchOutputSummary() {
  let rawResponse = await post("", postableFormData());
  let previewTable = generateOutputSummaryDom(rawResponse);
  return previewTable;
}

function generateOutputSummaryDom(str) {
  let parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  outputSummary = doc.getElementById("output_summary");
  getPreviewTable(doc).className = templatePreviewTableClass();
  return outputSummary;
}

function getPreviewTable(doc) {
  return doc.getElementsByClassName("attemptResults")[0]
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