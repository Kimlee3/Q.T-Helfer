import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const inputPath = resolve('data/deu-luther1912.osis.xml');
const outputPath = resolve('public/luther1912.json');

function decodeXml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

const xml = readFileSync(inputPath, 'utf8');
const verses = {};
const versePattern = /<verse osisID='([^']+)'>([\s\S]*?)<\/verse>/g;

for (const match of xml.matchAll(versePattern)) {
  const [, osisId, rawText] = match;
  const text = decodeXml(rawText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  if (text) {
    verses[osisId] = text;
  }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `${JSON.stringify({
    translation: 'Lutherbibel 1912',
    source: 'Public domain OSIS text from seven1m/open-bibles',
    generatedAt: new Date().toISOString(),
    verses,
  })}\n`
);

console.log(`Wrote ${Object.keys(verses).length} verses to ${outputPath}`);
