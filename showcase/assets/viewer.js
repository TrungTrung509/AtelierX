const viewer = document.querySelector('#hoodie');
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
if (viewer && loading && error) {
  viewer.addEventListener('load', () => { loading.hidden = true; });
  viewer.addEventListener('error', () => { loading.hidden = true; error.hidden = false; });
}
const contentPanel = document.querySelector('#product-content');
if (contentPanel) {
  fetch('./content.json').then(r => { if (!r.ok) throw new Error('Content unavailable'); return r.json(); }).then(content => {
    const put = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = String(text || ''); };
    put('product-title', content.title);
    put('product-summary', content.summary);
    let specs=document.getElementById('product-specifications');
    if(!specs){specs=document.createElement('dl');specs.id='product-specifications';contentPanel.insertBefore(specs,document.getElementById('product-credits'));}
    specs.replaceChildren();
    const rows=[...(content.material?.name?[{label:'Chất liệu thiết kế',value:content.material.name}]:[]),...(content.style?[{label:'Kiểu dáng',value:content.style}]:[]),...(content.specifications||[])];
    const labels={chestWidthCm:'Ngang ngực mẫu',garmentLengthCm:'Dài áo bao ngoài',sleeveExtentCm:'Độ vươn tay áo từ vai',shoulderReferenceCm:'Mốc vai mannequin'};
    for(const row of rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.style.fontWeight='600';dt.textContent=labels[row.label]||String(row.label);const value=typeof row.value==='number'?row.value.toLocaleString('vi-VN',{maximumFractionDigits:1}):row.value;dd.textContent=`${value}${row.unit?' '+row.unit:''}`;specs.append(dt,dd);}
    if(rows.length){const note=document.createElement('p');note.textContent='Thông số mẫu 3D tham khảo; không phải bảng size sản xuất.';specs.append(note);}
    for (const [key, tag] of [['paragraphs','p'], ['details','li'], ['credits','p']]) {
      const host = document.getElementById(`product-${key}`);
      if (!host) continue;
      host.replaceChildren();
      for (const text of Array.isArray(content[key]) ? content[key] : []) {
        const el = document.createElement(tag); el.textContent = String(text); host.append(el);
      }
    }
    contentPanel.dataset.loaded = 'true';
  }).catch(() => { const el = document.getElementById('content-error'); if (el) el.hidden = false; });
}
document.querySelector('#view-front')?.addEventListener('click', () => { viewer.cameraOrbit = '0deg 85deg auto'; });
document.querySelector('#view-back')?.addEventListener('click', () => { viewer.cameraOrbit = '180deg 85deg auto'; });
