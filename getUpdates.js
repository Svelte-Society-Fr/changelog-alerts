import { readFile, writeFile } from 'node:fs/promises';

const rawUrl = 'https://raw.githubusercontent.com';
const branch = 'master';

export default function (project) {
  const { owner, repo, path } = project;
  const url = [rawUrl, owner, repo, branch, path].join('/');

  return fetch(url)
    .then(r => r.text())
    .then(d => {
      const data = d
        .split('\n## ')
        .splice(1)
        .map(s => {
          const version = s.split('\n')[0];

          return { version, md: `## ${s}`, ...project };
        });

      const p = readFile(`latest/${repo}-latest.json`)
        .then(blob => {
          const previous = JSON.parse(blob);

          return data.filter(item => !previous.includes(item.version));
        })
        .catch(() => data);

      p.finally(() => {
        writeFile(
          `latest/${repo}-latest.json`,
          JSON.stringify(data.map(d => d.version)),
        );
      });

      return p;
    })
    .catch(() => []);
}
