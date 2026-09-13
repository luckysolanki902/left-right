const STORAGE_KEY = 'left-right.writing.v1';
const thoughts = document.querySelector('#thoughts');
const perspective = document.querySelector('#perspective');
const exampleButton = document.querySelector('#example-button');
const exampleLabel = document.querySelector('#example-label');
const storageStatus = document.querySelector('#storage-status');
const exampleStatus = document.querySelector('#example-status');
const help = document.querySelector('#help-dialog');
let writing = { thoughts: '', perspective: '' };
let showingExample = false;

const example = {
  thoughts: 'I keep thinking about everything I need to get done. It feels like I’m already behind.\n\nI said something awkward yesterday. What if they’re still thinking about it?\n\nI don’t know exactly where things are going, and that scares me.',
  perspective: 'I can choose one small task and give it ten minutes. I don’t need to do everything today.\n\nI can’t know what they’re thinking. One awkward moment doesn’t define me. I can let this one pass.\n\nI don’t need the whole plan right now. I can take care of what’s in front of me, and work out the next step when I get there.',
};

function showStorageError() {
  storageStatus.textContent = 'Browser storage is unavailable. Your writing will be lost when you leave this page.';
}

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (typeof parsed?.thoughts === 'string' && typeof parsed?.perspective === 'string') writing = parsed;
  }
} catch {
  showStorageError();
}

function render() {
  const content = showingExample ? example : writing;
  thoughts.value = content.thoughts;
  perspective.value = content.perspective;
  thoughts.readOnly = perspective.readOnly = showingExample;
  exampleButton.setAttribute('aria-pressed', String(showingExample));
  exampleLabel.textContent = showingExample ? 'Back to my writing' : 'See an example';
  storageStatus.hidden = showingExample;
  exampleStatus.hidden = !showingExample;
}

function save() {
  if (showingExample) return;
  writing = { thoughts: thoughts.value, perspective: perspective.value };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(writing));
    storageStatus.textContent = 'Only in this browser. Clear its storage, and these words disappear.';
  } catch {
    showStorageError();
  }
}

thoughts.addEventListener('input', save);
perspective.addEventListener('input', save);
exampleButton.addEventListener('click', () => {
  showingExample = !showingExample;
  render();
});
document.querySelector('#help-button').addEventListener('click', () => help.showModal());
document.querySelector('#close-help').addEventListener('click', () => help.close());
document.querySelector('#start-writing').addEventListener('click', () => {
  help.close();
  if (showingExample) {
    showingExample = false;
    render();
  }
  thoughts.focus();
});
help.addEventListener('click', (event) => {
  if (event.target !== help) return;
  const rect = help.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) help.close();
});
render();
