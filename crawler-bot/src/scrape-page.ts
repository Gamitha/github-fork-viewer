
export type GitHubStat = {
  repository: {
    name: string,
    url: string,
    profile: string
  },
  stars: string,
  forks: {
    count: number,
    repositories: GitHubStat[] | null
  },
  issues: string,
  pullRequests: string,
  createdAt: string,
  updatedAt: string
}
export function scrapePage(): GitHubStat[]{

  return [...document.querySelectorAll('.Layout-main > div.Box.mt-3 li')].map(el => {

    const normalizeSpaces = (str: string | null | undefined) => str?.replace(/\s+/g, ' ').trim();

    const h2s = [...el.querySelectorAll('h2 a')].map(a => ({
      text: a.textContent?.trim(),
      href: `https://github.com${a.getAttribute('href')}`
    }));

    //@ts-ignore
    const stats: Omit<GitHubStat, 'repository'> = [...el.querySelectorAll('div.mr-4.f6')].reduce((prev, curr, idx) => {
      switch (idx) {
        case 0:

          return {
            ...prev,
            stars: normalizeSpaces(curr.querySelector('a')?.textContent),
          }
        case 1:
          return {
            ...prev,
            forks: {
              count: parseInt(normalizeSpaces(curr.querySelector('a')?.textContent) || '0')
            }
          }
        case 2:
          return {
            ...prev,
            issues: normalizeSpaces(curr.querySelector('a')?.textContent)
          }
        case 3:
          return {
            ...prev,
            pullRequests: normalizeSpaces(curr.querySelector('a')?.textContent)
          }
        case 4:
          return {
            ...prev,
            createdAt: normalizeSpaces(curr.textContent)
          }
        case 5:
          return {
            ...prev,
            updatedAt: normalizeSpaces(curr.textContent)
          }

        default:
          return null;
      }
    }, {})
    // fork object
    return {
      repository: {
        name: h2s.map(h2 => h2.text).join(' '),
        url: h2s[1].href,
        profile: h2s[0].href
      },
      ...stats
    }
  });

}
