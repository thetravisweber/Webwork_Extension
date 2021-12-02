/*

  The method I am currently using for the live preview is to take the HTML
    from a request to the server for a full new page of the same problem, but
    with preview answers showing

  I am then shoveling this html into a new Document object, then using the vanilla
    javascript Web APIS to pull the HTMLTableElement object from this new document object,
    and then adding this as a child of the document being rendered to the user.
  
  This is not working because the document object being rendered to the user is rejecting
    this new child, because it did not give birth to it. I am sure this is an easy enough
    fix, and so if you can take a crack at it I would greatly appreciate it

    ----------

  If you revert back to commit fbaff69d84b05b5e5426725f2ff8eae924a31a23,
    you can see how I was trying to implement the live preview by updating
    the inner HTML of the page. The problem with this method is that updating
    innerHTML attributes will make the whole page rerender, which breaks the
    keybinds implemented in other files.

    ----------

  If you get this to work either way, then the next problem is in resizing the preview table.
    It will be very annoying if the live preview table is resizing consistently and the
    rest of the problem is shifting around the page.

  Another issue is that the live preview will likely be slow/delayed because we are making a
    full page request. If anyone knows who maintains webwork, and can get in contact with them,
    please ask for a barebone RESTAPI that can pass back solely the parsed equation string.

  For these 2 reasons, I recommend making a switch within the extension popup (popup.html),
    that allows the user to turn off live preview if it is giving them issues. This is the part
    that is really making me procrastinate this project, but it is very do-able.

    ----------

  I still intend to get a live preview working at some point, so if you can not
    figure it out, please let me know what you learned so I don't have to repeat your steps.

*/


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