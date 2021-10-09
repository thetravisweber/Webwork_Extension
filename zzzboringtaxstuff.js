let specialWordsPresent = 0;

function doNothing(answer) {
  switch (answer) {
    case 'hello' :
      alert("heyo 🤙");
      break;
    case 'help' :
      commandMenu();
      break;
    case containsNewlyTypedSpecialWord(answer) :
      alert("Watch your profanity");
      break;
  }
  if (answer == 'hello') {
  } else if (containsNewlyTypedSpecialWord(answer)) {
  }
}

function commandMenu() {
  alert('COMMANDS :\n shift + b : back \n shift + n : next \n enter with new solution: submit \n enter without new solution: next problem');
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