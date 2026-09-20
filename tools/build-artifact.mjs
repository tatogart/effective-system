#!/usr/bin/env node
/* Собирает dist/artifact.html из index.html.
   index.html — самостоятельный документ (его скачивают и открывают локально).
   Хостинг артефактов оборачивает страницу в свой каркас <!doctype><head><body>,
   поэтому для публикации нужен тот же файл без собственной обёртки. */
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const src = readFileSync('index.html', 'utf8');
const head = (src.match(/<head>([\s\S]*?)<\/head>/) || [,''])[1];
const body = (src.match(/<body>([\s\S]*?)<\/body>/) || [,''])[1];
if (!head || !body) { console.error('index.html: не найдены head или body'); process.exit(1); }

const keptHead = head
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<meta name="description"[^>]*>\s*/i, '')
  .replace(/<link rel="icon"[^>]*>\s*/i, '')
  .trim();

mkdirSync('dist', {recursive: true});
writeFileSync('dist/artifact.html', keptHead + '\n' + body.trim() + '\n');
console.log('dist/artifact.html готов:', keptHead.length + body.length, 'байт');
