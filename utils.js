import { Octokit } from '@octokit/rest';

const token = process.env.GITHUB_REPO_TOKEN;

const octokit = new Octokit({
  auth: token,
});

// const THREE_HOURS = 3 * 1000 * 60 * 60;
// const TWO_WEEKS = 24 * 14 * 1000 * 60 * 60;
const ONE_MONTH = 24 * 4 * 7 * 1000 * 60 * 60;
const limit = ONE_MONTH;
const per_page = 100;

export function extractAdditions(patch) {
  return patch
    .split('\n')
    .filter(s => s.startsWith('+'))
    .map(s => s.substring(1))
    .join('\n');
}

export async function getChangelog({ name, owner, repo, path }) {
  const since = new Date(Date.now() - limit).toISOString();

  const changedFiles = (
    await octokit.rest.repos.listCommits({
      owner,
      repo,
      path,
      per_page,
      since,
    })
  ).data;

  const sha = changedFiles[0]?.sha;
  if (!sha) {
    return undefined;
  }

  const commit = await octokit.rest.repos.getCommit({
    owner,
    repo,
    ref: sha,
  });

  const patch = commit.data.files.find(f => f.filename.includes(path))?.patch;

  console.log(name, patch);

  if (!patch) {
    return undefined;
  }

  return extractAdditions(patch);
}
