const readline = require('readline');

// YouTubeのショートカットキー
const shortCutKeys = [
  'n', // 次の曲
  'p', // 前の曲(プレイリストの場合のみ)
  'j', // 巻き戻し
  'k', // 早送り
  'l' // 一時停止・再生
];

module.exports = async (browser, page, pageWatcher, playList, onChangeCursor) => {

  process.stdin.on('keypress', async (str, key) => {
    // ctrl + c で終了
    if (key.sequence === '\u0003') {
      await browser.close();
      process.exit();
    }

    if (shortCutKeys.includes(key.name)) {
      await page.keyboard.down('Shift');
      await page.keyboard.down(key.name);
    }

    if (['up', 'down'].includes(key.name)) {

      if (!pageWatcher.isFinishedRedirect()) {
        return;
      }
      key.name === 'up' ? playList.prevCurrentIndex() : playList.nextCurrentIndex();
      onChangeCursor();
    }

    if (key.name === 'space') {
      playList.syncSelectedIndex();
      const video = playList.getSelectedVideo();
      pageWatcher.requestRedirect(video.url);
      onChangeCursor(video);
    }
  });

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
};