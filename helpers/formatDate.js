function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

module.exports = formatDate

// dipake utk posts.ejs & detail.ejs