console.log("am running");


chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("yeee");
  console.log(tab);
  chrome.tabs.sendMessage(tab.id, 'open_random_problem');
});



// chrome.webNavigation.onCompleted.addListener(function() {
//   alert("This is my favorite website!");
// });