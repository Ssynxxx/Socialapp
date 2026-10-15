
const { Profile, Post } = require("../models")

class ProfileController {
    static async profile(req, res) {
        try {
            const { id } = req.params

            const data = await Profile.getByUser(id)

            // Ambil semua post milik user yang profilnya dibuka
            const posts = await Post.findAll({
                where: { UserId: id },
                order: [["createdAt", "DESC"]]
            })

            res.render("profile.ejs", {
                data,
                id: Number(id),
                posts
            })
        } catch (error) {
            res.send(error)
        }
    }

    static async addForm(req, res) {
        try {
            const { UserId } = req.params

            // Hanya boleh membuat profil untuk akun sendiri
            if (Number(UserId) !== req.session.userId) {
                return res.redirect("/posts")
            }

            const data = await Profile.getByUser(UserId)

            if (data) {
                return res.redirect(`/profile/${UserId}`)
            }

            res.render("addProfile.ejs", {
                UserId,
                values: {},
                errors: []
            })
        } catch (error) {
            res.send(error)
        }
    }

    static async addProfile(req, res) {
        const { UserId } = req.params

        try {
            if (Number(UserId) !== req.session.userId) {
                return res.redirect("/posts")
            }

            const { imageProfile, bio, name } = req.body
            const data = await Profile.getByUser(UserId)

            if (data) {
                return res.redirect(`/profile/${UserId}`)
            }

            await Profile.create({
                imageProfile,
                bio,
                name,
                UserId: UserId
            })

            res.redirect(`/profile/${UserId}`)
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map((e) => e.message)
                const { imageProfile, bio, name } = req.body

                res.render("addProfile.ejs", {
                    UserId,
                    values: { imageProfile, bio, name },
                    errors
                })
            } else {
                res.send(error)
            }
        }
    }
}

module.exports = ProfileController
