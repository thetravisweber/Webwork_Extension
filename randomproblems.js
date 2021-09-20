chrome.runtime.onMessage.addListener(function (request) {
  // there is probably a cleaner way to do this, but I am not being paid for this
  if (request==="open_random_problem") {
    alert("for me!!");
  }
});

