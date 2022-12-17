const isMobile = (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ));
if (isMobile) {
  document.querySelector(`input[type="file"]`).attributes.removeNamedItem('multiple')
}

document.querySelector(`input[type="file"]`).addEventListener('change', (event) => {
  const files = event.target?.files
  if (!files.length) {
    return;
  }
  ([...files]).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      processImage(e.target.result)
    }
    reader.readAsDataURL(file)
  });
})

function processImage(src) {

  const image = new Image();
  image.onerror = () => {

  }
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)
    const imagaData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imagaData.data;

    let r = g = b = 0

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const totalPixels = canvas.width * canvas.height
    r /= totalPixels
    g /= totalPixels
    b /= totalPixels
    r = Math.trunc(r)
    g = Math.trunc(g)
    b = Math.trunc(b)
    const rgb = `rgb(${r},${g},${b})`
    createCard(src, rgb, rgbToHex(r, g, b))
  }
  image.src = src
}

function createCard(img, rgb, hex) {
  if (isMobile) {
    document.querySelector('.colors').innerHTML = ""
  }
  document.querySelector('.colors')
    .appendChild(getCard(img, rgb, hex, isRGBLight(...hexToRgb(hex))))
}

function getCard(img, rgb, hex, isLight) {

  const html = `
<div class="card">
  <div class="img-view">
    <img src="${img}" />
  </div>
  <div class='info'>
    <div
      class="color-preview"
      style="background-color: ${hex}"></div>

    <div class="color-info">
      <div class="color-item">
        <div class="color-title">HEX</div>
        <span class="color-name" clr="hex">${hex}</span>
      </div>
      <div class="color-item">
        <div class="color-title">RGB</div>
        <span class="color-name" clr="rgb">${rgb}</span>
      </div>
      <div class="color-item">
        <div class="color-title">Type</div>
        <span class="color-name">${isLight ? 'Light Color' : 'Dark Color'}</span>
      </div>
    </div>
  </div>
</div>
  `
  const card = new DOMParser().parseFromString(html, "text/html").body.firstChild
  card.querySelector('[clr="hex"]').addEventListener('click', () => copy(hex))
  card.querySelector('[clr="rgb"]').addEventListener('click', () => copy(rgb))
  return card
}

function copy(text) {
  try {
    navigator.clipboard.writeText(text);
    createAlert("Copied to clipboard!")
  } catch (err) {
    createAlert('Error on copy')
  }
}

function createAlert(text) {
  const html = `
<div class="alert">
  <div class="text">${text}</div>
  <div class="progress"></div>
</div>
  `
  const alert = new DOMParser().parseFromString(html, "text/html").body.firstChild
  alert.addEventListener('click', () =>
    document.querySelector('.alert-container').removeChild(alert)
  )
  setTimeout(() =>
    document.querySelector('.alert-container').removeChild(alert)
    , 2000
  )
  document.querySelector('.alert-container').appendChild(alert)
}



function isRGBLight(r, g, b) {
  return (((r * 299) + (g * 587) + (b * 114)) / 1000) > 155
}


const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

function hexToRgb(hex) {
  const temp = hex.replace('#', '').match(/.{1,2}/g)
  return [
    parseInt(temp[0], 16),
    parseInt(temp[1], 16),
    parseInt(temp[2], 16),
  ]
}

processImage(template)