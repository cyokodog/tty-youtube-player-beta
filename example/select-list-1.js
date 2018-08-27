const readline = require('readline');

const list = ['JavaScripot', 'TypeScript', 'CSS', 'HTML', 'Java', 'PHP', 'Python'];
let selectedLine = 0;

process.stdin.on('keypress', async (str, key) => {
  if (['up', 'down'].includes(key.name)) {
    const direction = key.name === 'up' ? -1 : 1;
    changeSelectedLine(direction);
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

function changeSelectedLine(direction) {
  const tempLine = selectedLine + direction;
  if (0 <= tempLine && tempLine < list.length) {
    selectedLine = tempLine;
  }
}

function render() {
  clear();
  const viewText = list
    .map((item, index) => {
      const cursor = index === selectedLine ? '> ' : '  ';
      return [cursor, item].join('');
    })
    .join('\n');
  console.log(viewText);
}

function clear() {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}