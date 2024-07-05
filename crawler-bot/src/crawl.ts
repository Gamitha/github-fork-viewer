import { Browser, Page } from "puppeteer-core";
import { scrapePage, GitHubStat } from "./scrape-page";

export async function crawlUrl(url: string, page: Page): Promise<GitHubStat[] | null> {

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const results = await page.evaluate(scrapePage);

  if (results.length < 1) {
    return null;
  }
  return results;
}


export async function crawlRepoStats(repoUrl: string, page: Page, data: GitHubStat[], current: number = 1) {
  const url = `${repoUrl}?page=${current}`;
  let result: GitHubStat[] | null = await crawlUrl(url, page);
  if (!result) {
    return data;
  }
  return crawlRepoStats(repoUrl, page, data.concat(result), current + 1)
}

export async function startCrawl(initialUrl: string, browser: Browser, data: GitHubStat[]) {
  const page = await browser.newPage();

  let results = await crawlRepoStats(initialUrl, page, []);
  results = await Promise.all(results?.map(async (stat) => {
    const repos = await startCrawl(`${stat.repository.url}/forks`, browser, [])
    console.log('child repos: ', repos, 'parent repo: ', stat.repository.url)
    return {
      ...stat,
      forks: {
        count: repos?.length,
        repositories: repos
      }
    }
  }));
  return results === null ? data : data.concat(results);
}
