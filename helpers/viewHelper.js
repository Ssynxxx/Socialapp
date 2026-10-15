function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function initials(name) {
  return String(name).split(' ').filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('')
}

function shorten(text, max = 100) {
  text = String(text || '')
  return text.length > max ? text.slice(0, max) + '...' : text
}

// dipakai di semua view lewat app.locals (lihat app.js)
module.exports = { formatDate, initials, shorten }
