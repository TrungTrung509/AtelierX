if (window.__ATEL23_PRODUCT_PAGE_INITIALIZED) throw new Error('ATEL-23/v1 page script loaded twice');
window.__ATEL23_PRODUCT_PAGE_INITIALIZED = true;
const viewer = document.querySelector('#hoodie');
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
viewer.addEventListener('load', () => { loading.hidden = true; });
viewer.addEventListener('error', () => { loading.hidden = true; error.hidden = false; });
document.querySelector('#view-front').addEventListener('click', () => {
  viewer.cameraOrbit = '0deg 82deg 3m';
  viewer.jumpCameraToGoal();
});
document.querySelector('#view-back').addEventListener('click', () => {
  viewer.cameraOrbit = '180deg 82deg 3m';
  viewer.jumpCameraToGoal();
});
const text = (id, value) => { if (value) document.getElementById(id).textContent = value; };
try {
  const response = await fetch('./content.json');
  if (!response.ok) throw new Error(`content.json HTTP ${response.status}`);
  const data = await response.json();
  if (data.orderId !== 'ATEL-23' || data.revision !== 'v1') throw new Error('content revision mismatch');
  text('product-title', data.title);
  text('product-summary', data.summary);
  if (data.artwork?.file) {
    const artwork = document.querySelector('#artwork-preview');
    artwork.src = data.artwork.file;
    artwork.hidden = false;
    document.title = `${data.title} · ${data.revision}`;
  }
  const paragraphs = document.querySelector('#product-paragraphs');
  paragraphs.replaceChildren();
  (data.paragraphs || []).forEach(value => {
    const p = document.createElement('p');
    p.textContent = value;
    paragraphs.append(p);
  });
  const details = document.querySelector('#product-details');
  details.replaceChildren();
  (data.details || []).forEach(value => {
    const li = document.createElement('li');
    li.textContent = value;
    details.append(li);
  });
  const credits = document.querySelector('#product-credits');
  credits.replaceChildren();
  (data.credits || []).forEach(value => {
    const p = document.createElement('p');
    p.textContent = value;
    credits.append(p);
  });
  if (!data.title || !data.summary || !(data.paragraphs || []).length) {
    document.querySelector('#product-summary').textContent = 'Đang chờ bản giới thiệu tiếng Việt từ lane Research.';
  }
} catch (e) {
  document.querySelector('#content-error').hidden = false;
  document.querySelector('#content-error').textContent = 'Không tải được content.json cùng revision ATEL-23/v1.';
  console.error(e);
}
