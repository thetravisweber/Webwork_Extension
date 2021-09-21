let specialWordsPresent = 0;

[...document.getElementsByTagName("input")].map(el => {
  if (el.type === "hidden") return;
  el.addEventListener("input", function() {
    typingAnswer(el);
  });
});

function typingAnswer(el) {
  enterSendsToNextPage = false;
  // updatePreviews();
  attachEasterEggs(el.value);
}

function attachEasterEggs(answer) {
  if (answer=="hi travis") {
    alert("heyo 🤙");
  } else if (containsNewlyTypedSpecialWord(answer)) {
    alert("Watch your profanity");
  }
}

function containsNewlyTypedSpecialWord(str) {
  let wordCount = countSpecialWords(str);
  if (wordCount == specialWordsPresent) return false;
  holder = specialWordsPresent;
  specialWordsPresent = wordCount;
  return wordCount > holder;
}

function countSpecialWords(str) {
  let specialWords = ['kcuf', 'tihs', 'nmad', 'hctib'];
  specialWords = specialWords.map(word => {return word.split('').reverse().join('');});
  let wordCount = 0;
  specialWords.forEach((word) => {wordCount+=str.includes(word)});
  return wordCount;
}