import { Octokit } from '@octokit/rest';

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

const octokit = new Octokit({
  auth: token,
});

const repo = {
  owner: 'sveltejs',
  repo: 'kit',
};

// const threeHours = 3 * 1000 * 60 * 60;
const twoWeeks = 24 * 14 * 1000 * 60 * 60;

export function extractAdditions(patch) {
  return patch
    .split('\n')
    .filter(s => s.startsWith('+'))
    .map(s => s.substring(1))
    .join('\n');
}

export async function getChangelog(path) {
  const per_page = 100;
  const since = new Date(Date.now() - twoWeeks).toISOString();

  const changedFiles = (
    await octokit.rest.repos.listCommits({
      ...repo,
      path,
      per_page,
      since,
    })
  ).data;

  const sha = changedFiles[0].sha;
  const commit = await octokit.rest.repos.getCommit({
    ...repo,
    ref: sha,
  });

  return extractAdditions(
    commit.data.files.find(f => f.filename.includes('kit/CHANGELOG')).patch,
  );
}
