const puppeteer = require('puppeteer');

const text = process.argv[2];

(async (text) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=0,0',
      '--window-position=0,0',
    ]
  });
  const page = await browser.newPage();
  await page.evaluate(text => {
    return new Promise(resolve => {
      const uttr = new SpeechSynthesisUtterance();
      uttr.text = text;
      speechSynthesis.speak(uttr);
      uttr.onend = () => {
        resolve();
      };
    });
  }, text);
  await browser.close();
})(text);