const { Profile } = require("../models")

class ProfileController {
    static async profile(req, res) {
        try {
            const { id } = req.params
            const data = await Profile.getByUser(id)
            res.render("profile.ejs", { data, id })
        } catch (error) {
            res.send(error)
        }
    }

    static async addForm(req, res) {
        try {
            const { UserId } = req.params
            const data = await Profile.getByUser(UserId)

            if (data) {
                return res.redirect(`/profile/${UserId}`)
            } 

            res.render("addProfile.ejs", { data, errors: [] })
        } catch (error) {
            res.send(error)
        }
    }

    static async addProfile(req, res) {
        const { UserId } = req.params
        try {
            const { imageProfile, bio, name } = req.body
            const data = await Profile.getByUser(UserId)

            if (data) {
                return res.redirect(`/profile/${UserId}`)
            }

            await Profile.create({ imageProfile, bio, name, UserId: UserId })
            res.redirect(`/profile/${UserId}`)
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map((e) => e.message)
                const data = await Profile.getByUser(UserId)

                if (data) {
                    return res.redirect(`/profile/${UserId}`)
                }

                res.render("addProfile.ejs", { data, errors })
            } else {
                res.send(error)
            }
        }
    }
}

module.exports = ProfileController