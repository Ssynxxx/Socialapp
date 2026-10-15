const express = require('express');
const session = require('express-session')
const router = require('./routers');
const { formatDate, initials, shorten } = require('./helpers/viewHelper')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(session({
  secret: 'ayam jambul',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true
  }
}))

// helper + data user login tersedia di semua view EJS
app.locals.formatDate = formatDate
app.locals.initials = initials
app.locals.shorten = shorten
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId
    ? { id: req.session.userId, role: req.session.role }
    : null
  next()
})

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
