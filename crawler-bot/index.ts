import puppeteer, { Browser } from 'puppeteer-core';
import fs from 'fs';
import { startCrawl } from './src/crawl'
import { GitHubStat } from './src/scrape-page';

// Replace with the actual path to your Chrome executable
const CHROME_EXECUTABLE_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

(async () => {
  let browser: Browser;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      executablePath: CHROME_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const initialUrl = 'https://github.com/nestjsx/crud/forks';

    const res = await startCrawl(initialUrl, browser, [])
    const results = {
      repository: {
        name: "nestjsx crud",
        url: initialUrl,
        profile: "https://github.com/nestjsx"
      },
      stars: '0',
      forks: {
        count: res.length,
        repositories: res
      }
    }

    const outputDir = './output'

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(`${outputDir}/data.json`, JSON.stringify(results, null, 2));

    console.log("results: ", results);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    //@ts-ignore
    if (browser) {
      await browser.close();
    }
  }
})();
