const defaultQuery = 'results?search_query=music';
const playFlags = {
  '-s': 'results?search_query=',
  '-v': 'watch?v='
};
const baseUrl = 'https://www.youtube.com/';

module.exports = async (page) => {
  const query = Object.keys(playFlags).reduce((output, key) => {
    const flagIdx = process.argv.findIndex(item => item === key);
    return flagIdx === -1 ? output : playFlags[key] + process.argv.slice(flagIdx + 1).join(' ');
  }, defaultQuery);

  await page.goto(baseUrl + query);

  // キーワード検索した場合は URL が results になる
  if (/^results/.test(query)) {
    const selector = 'a[href^="/watch?v="]';
    await page.waitForSelector(selector);
    await page.click(selector);
  }
};