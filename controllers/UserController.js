const { User } = require("../models")
const bcrypt = require("bcryptjs")

class UserController {
    static landing(req, res) {
        res.render("landing.ejs")
    }

    static async registerForm(req, res) {
        try {
            res.render("regis.ejs", { errors: [] })
        } catch (error) {
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            const { email, username, password, role } = req.body
            await User.create({ email, username, password, role })
            res.redirect("/login")
        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
                const errors = error.errors.map((e) => e.message)
                res.render("regis.ejs", { errors })
            } else {
                res.send(error)
            }
        }
    }

    static async loginForm(req, res) {
        try {
            const { error } = req.query
            res.render("login.ejs", { error })
        } catch (error) {
            res.send(error)
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({
                where: {
                    email
                }
            })

            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password)
                if (isValidPassword) {
                    req.session.userId = user.id
                    req.session.role = user.role

                    return res.redirect("/posts")
                } else {
                    const error = "Invalid Email/Password"
                    return res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = "Invalid Email/Password"
                return res.redirect(`/login?error=${error}`)   
            }
        } catch (error) {
            res.send(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.redirect("/login")
                }
            })
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = UserController