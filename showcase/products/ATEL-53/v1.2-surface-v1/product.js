const v = document.querySelector('#shirt');
for (const [id, orbit] of [['front','0deg 82deg auto'], ['back','180deg 82deg auto'], ['side','90deg 82deg auto'], ['oblique','45deg 82deg auto']]) {
  document.getElementById(id)?.addEventListener('click', () => { v.cameraOrbit = orbit; });
}
fetch('./content.json').then(r => { if (!r.ok) throw new Error('content'); return r.json(); }).then(c => {
  document.title = `${c.title} · ATEL-53`;
  document.getElementById('title').textContent = c.title;
  document.getElementById('summary').textContent = c.summary;
  document.getElementById('description').textContent = c.description;
  document.getElementById('dimensions-note').textContent = c.displayDimensionsNote;
  document.getElementById('credits').textContent = (c.credits || []).join(' ');
  for (const x of c.specifications || []) {
    const dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = x.label;
    dd.textContent = `${x.value} ${x.unit}`;
    document.getElementById('specs').append(dt, dd);
  }
  document.getElementById('product-content').dataset.loaded = 'true';
}).catch(() => { document.getElementById('product-content').dataset.loaded = 'error'; });
