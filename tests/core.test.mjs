import test from 'node:test';
import assert from 'node:assert/strict';
import { readPath, formatFreshness } from '../src/fetchers.js';
import { renderDashboard, esc } from '../src/render.js';

test('readPath reads object and array paths', () => {
  assert.equal(readPath({ stations: [{ level: 4.2 }] }, 'stations.0.level'), 4.2);
});

test('formatFreshness handles missing time', () => {
  assert.equal(formatFreshness(null).status, 'unknown');
});

test('esc escapes unsafe HTML', () => {
  assert.equal(esc('<script>'), '&lt;script&gt;');
});

test('dashboard includes source and disclaimer', () => {
  const html = renderDashboard({title:'LocalRoots Water Watch',area:'Test',theme:{subtitle:'Test'},disclaimer:'Official warnings take priority',cameras:[],links:[{label:'Source',url:'https://example.com'}]},[]);
  assert.match(html, /LocalRoots Water Watch/);
  assert.match(html, /Official warnings take priority/);
  assert.match(html, /https:\/\/example\.com/);
});
