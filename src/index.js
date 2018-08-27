const getBrowserAndPage = require('./get-browser-and-page');
const play = require('./play');
const PlayList = require('./playlist');
const PageWatcher = require('./page-watcher');
const controlKeypress = require('./control-keypress');
const render = require('./render');

(async () => {
  const {
    browser,
    page
  } = await getBrowserAndPage();

  await play(page);

  const playList = new PlayList();
  const pageWatcher = new PageWatcher();

  pageWatcher.startWatch(page, playList, onChangeVideoOrCursor);

  await controlKeypress(browser, page, pageWatcher, playList, onChangeVideoOrCursor);

  function onChangeVideoOrCursor() {
    render(playList);
  }
})();