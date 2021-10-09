[...document.getElementsByClassName("mq-editable-field")].map(el => {
  
  el.addEventListener("input", function() {
    typingAnswer(el);
  });
});

function extractAnswer(el) {
  let root = el.getElementsByClassName('mq-root-block')[0];
  let chars = [...root.children];
  let input = chars.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.innerText.toString();
  }, "");
  return input.substring(0, input.length-1);
}

function typingAnswer(el) {
  enterSendsToNextPage = false;
  // uncomment if you want to try to work on the live preview
  // updatePreviews();
  doNothing(extractAnswer(el));
}

// more convenient ui for elements with select tag while correct/incorrect answer previews are available
let selectElements = [...document.getElementsByTagName('select')];
let correctElements = [];
let incorrectElements = [];
for (let i = 0; i < selectElements.length; i++) {
  let classList = [...selectElements[i].classList];
  
  if (classList.includes('correct')) {
    correctElements.push(selectElements[i]);
  } else if (classList.includes('incorrect')) {
    incorrectElements.push(selectElements[i]);
  }
}

for (let i = 0; i < correctElements.length; i++) {
  correctElements[i].style = 'border-color: rgba(81,153,81, 0.8); outline: 0; box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(81 153 81 / 60%); color: inherit;';
}

for (let i = 0; i < incorrectElements.length; i++) {
  incorrectElements[i].style = 'border-color: rgba(191, 84, 84, 0.8); outline: 0; box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(191 84 84 / 60%); color: inherit;';
}