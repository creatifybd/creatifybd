import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

HelmetProvider.canUseDOM = false;
export function render(url) {
  const helmetContext = {};
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    output.setEncoding('utf8');
    let html = '';
    output.on('data', chunk => { html += chunk.toString(); });
    output.on('error', reject);
    output.on('end', () => {
      const helmet = helmetContext.helmet;
      resolve({ html, head: helmet ? [helmet.title, helmet.meta, helmet.link, helmet.script].map(part => part.toString()).join('\n') : '' });
    });
    const stream = renderToPipeableStream(<React.StrictMode><App RouterComponent={StaticRouter} location={url} helmetContext={helmetContext} /></React.StrictMode>, {
      onAllReady() { stream.pipe(output); },
      onShellError: reject,
      onError: reject,
    });
  });
}
