[...document.getElementsByTagName("input")].map(el => {
  if (el.type === "hidden") return;
  el.addEventListener("input", function() {
    typingAnswer(el);
  });
});

function typingAnswer(el) {
  enterSendsToNextPage = false;
  // updatePreviews();
  doNothing(el.value);
}

