function readPath(value, path) {
  if (!path) return value;
  return String(path).split('.').reduce((current, key) => {
    if (current == null) return undefined;
    if (/^\d+$/.test(key) && Array.isArray(current)) return current[Number(key)];
    return current[key];
  }, value);
}

function formatFreshness(observedAt) {
  if (!observedAt) return { status: 'unknown', label: 'ไม่พบเวลาของข้อมูล' };
  const ts = Date.parse(observedAt);
  if (!Number.isFinite(ts)) return { status: 'unknown', label: 'อ่านเวลาของข้อมูลไม่ได้' };
  const ageMinutes = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (ageMinutes <= 120) return { status: 'fresh', ageMinutes, label: `อัปเดต ${ageMinutes} นาทีที่แล้ว` };
  if (ageMinutes <= 360) return { status: 'recent', ageMinutes, label: `อัปเดตประมาณ ${Math.round(ageMinutes / 60)} ชม.ที่แล้ว` };
  if (ageMinutes <= 1440) return { status: 'aging', ageMinutes, label: `ข้อมูลเก่าประมาณ ${Math.round(ageMinutes / 60)} ชม.` };
  return { status: 'stale', ageMinutes, label: `ข้อมูลเก่าประมาณ ${Math.max(1, Math.round(ageMinutes / 1440))} วัน` };
}

async function fetchJson(url, timeoutMs = 10000, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json, text/plain;q=0.8', ...headers },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function loadMetric(metric, env = {}) {
  const sourceUrl = metric.sourceUrl || metric.url;
  const target = new URL(metric.url);
  const headers = {};

  if (metric.apiKeyEnv) {
    const secret = env?.[metric.apiKeyEnv];
    if (!secret) {
      return {
        ...metric,
        ok: false,
        sourceUrl,
        error: `Missing environment secret: ${metric.apiKeyEnv}`,
        freshness: { status: 'unknown', label: 'ยังไม่ได้ตั้งค่า API key' }
      };
    }
    if (metric.apiKeyQueryParam) target.searchParams.set(metric.apiKeyQueryParam, secret);
    if (metric.apiKeyHeader) headers[metric.apiKeyHeader] = secret;
  }

  try {
    const json = await fetchJson(target.toString(), metric.timeoutMs || 10000, headers);
    const rawValue = readPath(json, metric.valuePath);
    const observedAt = readPath(json, metric.timePath);
    const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    return {
      ...metric,
      ok: Number.isFinite(numericValue),
      value: Number.isFinite(numericValue) ? numericValue : rawValue ?? null,
      observedAt: observedAt ?? null,
      sourceUrl,
      freshness: formatFreshness(observedAt),
      error: Number.isFinite(numericValue) || rawValue != null ? null : 'Value path not found'
    };
  } catch (error) {
    return {
      ...metric,
      ok: false,
      value: null,
      observedAt: null,
      sourceUrl,
      freshness: { status: 'unknown', label: 'อ่านข้อมูลต้นทางไม่สำเร็จ' },
      error: error?.message || 'fetch failed'
    };
  }
}

export async function loadAllMetrics(config, env = {}) {
  const metrics = Array.isArray(config.jsonMetrics) ? config.jsonMetrics : [];
  return Promise.all(metrics.map(metric => loadMetric(metric, env)));
}

export { readPath, formatFreshness };
