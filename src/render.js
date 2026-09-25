function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function statusClass(status) {
  return ['fresh', 'recent', 'aging', 'stale'].includes(status) ? status : 'unknown';
}

export function renderDashboard(config, metrics = []) {
  const accent = config?.theme?.accent || '#0f766e';
  const metricCards = metrics.length
    ? metrics.map(item => `
      <article class="card">
        <div class="eyebrow">${esc(item.group || 'ข้อมูลพื้นที่')}</div>
        <h2>${esc(item.label || item.id || 'Metric')}</h2>
        <div class="value">${item.value == null ? '—' : esc(item.value)} <span>${esc(item.unit || '')}</span></div>
        <div class="freshness ${statusClass(item.freshness?.status)}">${esc(item.freshness?.label || 'ไม่ทราบความสดของข้อมูล')}</div>
        ${item.note ? `<p>${esc(item.note)}</p>` : ''}
        <a href="${esc(item.sourceUrl || item.url || '#')}" target="_blank" rel="noreferrer">ดูแหล่งข้อมูลต้นทาง ↗</a>
      </article>`).join('')
    : `<article class="card empty"><h2>ยังไม่ได้ตั้งค่า live metric</h2><p>เพิ่มรายการใน <code>config/localroots.config.json</code> โดยระบุ URL และ JSON path ของข้อมูลพื้นที่</p></article>`;

  const cameraCards = (config.cameras || []).map(camera => `
    <article class="card camera">
      <h2>${esc(camera.label || 'กล้องพื้นที่')}</h2>
      ${camera.imageUrl ? `<img src="${esc(camera.imageUrl)}" alt="${esc(camera.alt || camera.label || 'กล้องพื้นที่')}" loading="lazy">` : ''}
      ${camera.note ? `<p>${esc(camera.note)}</p>` : ''}
      <a href="${esc(camera.pageUrl || camera.imageUrl || '#')}" target="_blank" rel="noreferrer">เปิดต้นทาง ↗</a>
    </article>`).join('');

  const links = (config.links || []).map(link => `
    <li><a href="${esc(link.url)}" target="_blank" rel="noreferrer">${esc(link.label)}</a>${link.note ? `<span>${esc(link.note)}</span>` : ''}</li>`).join('');

  return `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(config.title)} — ${esc(config.area)}</title>
<meta name="description" content="${esc(config?.theme?.subtitle || 'LocalRoots Water Watch')}">
<style>
:root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#10231f;background:#f3f7f5;--accent:${esc(accent)}}
*{box-sizing:border-box}body{margin:0}a{color:var(--accent)}header{background:#fff;border-bottom:1px solid #dbe7e2;padding:28px 20px}main{max-width:1120px;margin:auto;padding:24px 20px 56px}.wrap{max-width:1120px;margin:auto}.kicker{font-weight:800;color:var(--accent);letter-spacing:.04em}.title{font-size:clamp(2rem,7vw,4rem);margin:.15em 0}.area{font-size:1.15rem;color:#49625b}.subtitle{max-width:760px;line-height:1.65;color:#425b54}.notice{margin:22px 0;padding:16px 18px;background:#fff8db;border:1px solid #eadb94;border-radius:16px;line-height:1.6}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}.card{background:#fff;border:1px solid #dbe7e2;border-radius:18px;padding:18px;box-shadow:0 5px 18px rgba(22,57,48,.05)}.eyebrow{font-size:.8rem;font-weight:800;text-transform:uppercase;color:#668078}.card h2{margin:.35rem 0 1rem;font-size:1.15rem}.value{font-size:2.1rem;font-weight:800}.value span{font-size:1rem;font-weight:600;color:#60766f}.freshness{display:inline-block;margin:10px 0 12px;padding:5px 9px;border-radius:999px;font-size:.82rem;background:#edf1ef}.freshness.fresh{background:#daf3e5}.freshness.recent{background:#e7f2dd}.freshness.aging{background:#fff1c4}.freshness.stale{background:#ffe0dc}.camera img{width:100%;border-radius:12px;background:#e6eeeb;aspect-ratio:16/9;object-fit:cover}.sources{margin-top:30px}.sources li{margin:12px 0}.sources span{display:block;color:#60766f;font-size:.9rem;margin-top:3px}footer{border-top:1px solid #dbe7e2;padding:24px 20px;color:#60766f;background:#fff}code{font-size:.85em}.empty{grid-column:1/-1}
</style></head><body>
<header><div class="wrap"><div class="kicker">LOCALROOTS WATER WATCH</div><h1 class="title">${esc(config.title)}</h1><div class="area">${esc(config.area)}</div><p class="subtitle">${esc(config?.theme?.subtitle || '')}</p></div></header>
<main><div class="notice">${esc(config.disclaimer || '')}</div><section class="grid">${metricCards}</section>${cameraCards ? `<h2>กล้องพื้นที่</h2><section class="grid">${cameraCards}</section>` : ''}<section class="sources"><h2>แหล่งข้อมูลที่ควรตรวจสอบร่วมกัน</h2><ul>${links}</ul></section></main>
<footer><div class="wrap">Open-source community starter • แสดงแหล่งต้นทางและความสดของข้อมูลเพื่อให้ตรวจสอบย้อนกลับได้</div></footer>
</body></html>`;
}

export { esc };
