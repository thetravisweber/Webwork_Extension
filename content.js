[...document.getElementsByTagName("input")].map(el => {
  if (el.type === "hidden") return;
  el.addEventListener("input", function() {
    typingAnswer(el);
  });
});

function typingAnswer(el) {
  enterSendsToNextPage = false;
  // uncomment if you want to try to work on the live preview
  // updatePreviews();
  doNothing(el.value);
}