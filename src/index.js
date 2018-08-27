const getBrowserAndPage = require('./get-browser-and-page');
const play = require('./play');
const PlayList = require('./playlist');
const PageWatcher = require('./page-watcher');
const controlKeypress = require('./control-keypress');
const render = require('./render');
const speak = require('./speak');

(async () => {
  const {
    browser,
    page
  } = await getBrowserAndPage();

  await play(page);

  const playList = new PlayList();
  const pageWatcher = new PageWatcher(page, playList);

  pageWatcher.onChangeVideo(video => {
    render(playList);
    speak(page, video.title);
  });

  controlKeypress(browser, page, pageWatcher, playList, () => {
    render(playList);
  });

})();