document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("study_problem_button").addEventListener('click', onclick, false);
  
  function onclick () {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, 'open_random_problem');
    });
  }
}, false)