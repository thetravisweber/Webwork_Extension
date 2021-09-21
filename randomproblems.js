chrome.runtime.onMessage.addListener(async function (request) {
  // there is probably a cleaner way to do this, but I am not being paid for this
  if (request==="open_random_problem") {
    pullProblemSets().then(pullProblemsFromRandomSet).then(navigateToRandomProblem);
  }
});

async function pullProblemsFromRandomSet(problemSets) {
  console.log(problemSets);
  if (problemSets.length === 0) {
    alert('fail');
    return;
  }
  let randomSet = pickRandomSet(problemSets);
  return getProblemListFromSet(randomSet);
}

async function getProblemListFromSet(problemSet) {
  let page = await get(problemSet.href);
  let parser = new DOMParser();
  let doc = parser.parseFromString(page, "text/html");
  return [...doc.getElementsByTagName("a")].filter(el => {
    return el.innerText.includes("Problem");
  });
}

function navigateToRandomProblem(potentialProblems) {
  console.log(potentialProblems);
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
  console.log(problemSetsPath());
  let page = await get(problemSetsPath());
  let parser = new DOMParser();
  let doc = parser.parseFromString(page, "text/html");
  return [...doc.getElementsByClassName("set-id-tooltip")];
}

function problemSetsPath() {
  let paths = window.location.pathname.split("/");
  let goodPaths = paths.filter(path => {
    console.log(path, isNaN(path), path.length);
    return !path.includes("set") && (isNaN(path) || path.length == 0);
  })
  console.log(paths, goodPaths);
  problem_sets_path = goodPaths.join("/");
  return window.location.origin + problem_sets_path + window.location.search;
}

function get(url, method = 'GET') {
  console.log(url);
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