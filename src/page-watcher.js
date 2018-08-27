const Video = require('./video');

module.exports = class PageWatcher {
  constructor() {
    this.redirectUrl = '';
  }

  requestRedirect(url) {
    this.redirectUrl = url;
  }

  finishedRedirect() {
    this.redirectUrl = '';
  }

  isFinishedRedirect() {
    return this.redirectUrl === '';
  }

  async execRedirect(page) {
    if (this.isFinishedRedirect()) {
      return;
    }
    await page.goto(this.redirectUrl);
    await page.waitForFunction(() => {
      return !!document.querySelector('h1.title');
    });
    this.finishedRedirect();
  }

  async getPageTitleAndUrl(page) {
    const el = await page.$('h1.title');
    if (!el) {
      return {
        isChangedPage: false
      };
    }
    const prop = await el.getProperty('textContent');
    const title = await prop.jsonValue();
    const url = await page.url();
    return {
      isChangedPage: !!title,
      title,
      url
    };
  }

  startWatch(page, playList, onChangeVideo) {
    const watch = async () => {
      await this._watch(page, playList, onChangeVideo);
      setTimeout(watch, 300);
    };
    watch();
  }

  async _watch(page, playList, onChangeVideo) {
    if (!this.isFinishedRedirect()) {
      await this.execRedirect(page);
      return;
    }
    await this._watchChangingVideo(page, playList, onChangeVideo);
  }

  async _watchChangingVideo(page, playList, onChangeVideo) {
    const {
      isChangedPage,
      title,
      url
    } = await this.getPageTitleAndUrl(page);
    if (!isChangedPage) {
      return;
    }
    const video = new Video(title, url);
    if (playList.hasSelectedVideo() && playList.getSelectedVideo().equal(video)) {
      return;
    }
    if (playList.selectedIndexIsLast()) {
      playList.addVideo(video);
      playList.nextCurrentIndex(true);
      onChangeVideo();
      return;
    }
    if (this.isFinishedRedirect()) {
      playList.nextCurrentIndex(true);
      const selectedUrl = playList.getSelectedVideo().url;
      if (selectedUrl !== url) {
        this.requestRedirect(selectedUrl);
      }
      onChangeVideo();
    }
  }

};