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

      const p = readFile(`versions/${repo}-latest.json`)
        .then(blob => {
          const previous = JSON.parse(blob);

          console.log('Previous', previous.length);
          console.log('Data', data.length);

          return data.filter(item => !previous.includes(item.version));
        })
        .catch(e => {
          console.log('No artifact found', e);
          return [data[0]];
        });

      p.finally(() => {
        writeFile(
          `versions/${repo}-latest.json`,
          JSON.stringify(data.map(d => d.version)),
        );
      });

      return p;
    })
    .catch(() => []);
}
