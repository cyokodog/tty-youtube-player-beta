const readline = require('readline');

const list = ['JavaScripot', 'TypeScript', 'CSS', 'HTML', 'Java', 'PHP', 'Python'];
const cursor = {
  currentLine: 0,
  selectedLine: 0
}

process.stdin.on('keypress', async (str, key) => {
  if (['up', 'down'].includes(key.name)) {
    const direction = key.name === 'up' ? -1 : 1;
    changeCurrentLine(direction);
    render();
  }
  if (key.name === 'space') {
    cursor.selectedLine = cursor.currentLine;
    render();
  }

  // ctrl + c で終了
  if (key.sequence === '\u0003') {
    process.exit();
  }
});
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

render();

function changeCurrentLine(direction) {
  const tempLine = cursor.currentLine + direction;
  if (0 <= tempLine && tempLine < list.length) {
    cursor.currentLine = tempLine;
  }
}

function render() {
  clear();
  const viewText = list
    .map((item, index) => {
      const current = index === cursor.currentLine ? '>' : ' ';
      const selected = index === cursor.selectedLine ? '◉ ' : '◯ '
      return [current, selected, item].join('');
    })
    .join('\n');
  console.log(viewText);
}

function clear() {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}