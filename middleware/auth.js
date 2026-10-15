const isLoggedIn = (req, res, next) => {
    if(!req.session.userId) {
        const error = "Please login first!"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
} 

module.exports = isLoggedIn