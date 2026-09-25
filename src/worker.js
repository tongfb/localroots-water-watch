import config from '../config/localroots.config.json' with { type: 'json' };
import { loadAllMetrics } from './fetchers.js';
import { renderDashboard } from './render.js';

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return Response.json({ ok: true, project: config.project, area: config.area, environment: env?.APP_ENV || 'unknown' }, { headers: JSON_HEADERS });
    }
    if (url.pathname === '/api/config') {
      const publicConfig = { ...config, jsonMetrics: (config.jsonMetrics || []).map(({ apiKeyEnv, ...metric }) => metric) };
      return Response.json(publicConfig, { headers: JSON_HEADERS });
    }
    if (url.pathname === '/api/data') {
      const metrics = await loadAllMetrics(config, env);
      return Response.json({ ok: true, generatedAt: new Date().toISOString(), area: config.area, metrics }, { headers: JSON_HEADERS });
    }
    if (url.pathname !== '/' && url.pathname !== '/index.html') return new Response('Not found', { status: 404 });
    const metrics = await loadAllMetrics(config, env);
    return new Response(renderDashboard(config, metrics), {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': `public, max-age=${Math.max(30, Number(config.refreshSeconds || 300))}`
      }
    });
  }
};
