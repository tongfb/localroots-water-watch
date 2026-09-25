import fs from 'node:fs';
const path = new URL('../config/localroots.config.json', import.meta.url);
const config = JSON.parse(fs.readFileSync(path, 'utf8'));
const required = ['project', 'title', 'area', 'timezone'];
for (const key of required) {
  if (!config[key] || typeof config[key] !== 'string') throw new Error(`config.${key} is required`);
}
if (!Array.isArray(config.jsonMetrics)) throw new Error('config.jsonMetrics must be an array');
if (!Array.isArray(config.cameras)) throw new Error('config.cameras must be an array');
if (!Array.isArray(config.links)) throw new Error('config.links must be an array');
for (const metric of config.jsonMetrics) {
  if (!metric.id || !metric.label || !metric.url || !metric.valuePath) throw new Error('Every jsonMetric requires id, label, url and valuePath');
}
console.log('LocalRoots config OK');
