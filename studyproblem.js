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
    alert('fail');
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

async function pullProblemSets() {
  let page = await get(problemSetsPath());
  let parser = new DOMParser();
  let doc = parser.parseFromString(page, "text/html");
  return [...doc.getElementsByClassName("set-id-tooltip")];
}

function problemSetsPath() {
  let paths = window.location.pathname.split("/");
  let goodPaths = paths.filter(path => {
    return !path.includes("set") && (isNaN(path) || path.length == 0);
  });
  problem_sets_path = goodPaths.join("/");
  return window.location.origin + problem_sets_path + window.location.search;
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