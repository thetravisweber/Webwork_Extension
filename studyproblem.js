chrome.runtime.onMessage.addListener(async function (request) {
  // there is probably a cleaner way to do this, but whatev
  if (request==="open_random_problem") {
    chrome.storage.sync.get([studySetsKey], function(studySets) {
      let setLinks = Object.values(studySets[studySetsKey]);
      pullProblemsFromRandomSet(setLinks).then(navigateToRandomProblem);
    }); 
  }
});

async function pullProblemsFromRandomSet(problemSets) {
  if (problemSets.length === 0) {
    alert('You have no Study Sets selected to choose from');
    return;
  }
  let randomSet = pickRandomSet(problemSets);
  return getProblemListFromSet(randomSet);
}

async function getProblemListFromSet(problemSet) {
  let url = fullUrl(problemSet);
  try {
    let page = await get(url);
    let parser = new DOMParser();
    let doc = parser.parseFromString(page, "text/html");
    let aTags = [...doc.getElementsByTagName("a")];
    if (aTags.length == 0) {
      throw 'no problems';
    }
    return aTags.filter(el => {
      return el.innerText.includes("Problem");
    });
  } catch {
    alert("failed 😔");
    return;
  } 
}

function fullUrl(url) {
  return window.location.origin + url + window.location.search;
}

function navigateToRandomProblem(potentialProblems) {
  let problem = pickRandomProblem(potentialProblems);
  navigateTo(problem);
}

function navigateTo(problem) {
  window.location.assign(problem.href);
}

function pickRandomSet(problemSets) {
  return problemSets[Math.floor(problemSets.length*Math.random())];
}

function pickRandomProblem(problems) {
  return problems[Math.floor(problems.length*Math.random())];
}

function get(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => {
      if (xhr.status === 200) { resolve(xhr.responseText); }
      else { reject(new Error(xhr.responseText)); }
    };
    xhr.send();
  });
}