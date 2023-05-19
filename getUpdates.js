import { parse } from 'marked';
import { JSDOM } from 'jsdom';
import { readFile, writeFile } from 'node:fs/promises';

const parserByRepo = {
  svelte: html => {
    const document = new JSDOM(html).window.document;
    const sections = document.querySelectorAll('h2');
    const data = document.querySelector('h2 + ul, h3 + ul').textContent;
  },
  kit: html => html,
};

export default function ({ name, owner, repo, path }) {
  return fetch(path)
    .then(r => r.text())
    .then(d => {
      const data = d
        .split('\n## ')
        .splice(1)
        .map(s => {
          const version = s.split('\n')[0];

          return { name, version, md: `## ${s}` };
        });

      const p = readFile(`latest/${repo}-latest.json`).then(blob => {
        const previous = JSON.parse(blob);

        return data.filter(item => !previous.includes(item.version));
      });

      p.finally(() => {
        writeFile(
          `latest/${repo}-latest.json`,
          JSON.stringify(data.map(d => d.version)),
        );
      });

      return p;
      // console.log(
      //   'data',
      //   data.map(d => d.version),
      // );

      // const version = document.querySelector('h2').textContent;
      // const data = document.querySelector('h2 + ul, h3 + ul').textContent;

      // console.log(data);
    })
    .catch(() => []);
}
