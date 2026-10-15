const { Post } = require("../models")
const { Op } = require("sequelize");

class PostsController {
    static async posts(req, res) {
        try {
            const { search, sort } = req.query
            const option = {}
            if(search) {
                option.where = {
                    title: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            }

            if (sort == 'title') {
                option.order = [['title', 'ASC']]
            }

            const data = await Post.findAll(option)

            res.render("posts.ejs", { data })
        } catch (error) {
            res.send(error)
        }
    }

    static async detail(req, res) {
        try {
            const { id } = req.params
            const post = await Post.getById(id)
            if (!post) {
                return res.redirect('/posts')
            }

            res.render("detail", { post, userId: req.session.userId })
        } catch (error) {
            res.send(error)
        }
    }

    static async addForm(req, res) {
        try {
            res.render("addPost.ejs", { errors: [] })
        } catch (error) {
            res.send(error)
        }
    }

    static async addPost(req, res) {
        const { title, caption, imageUrl } = req.body
        try {
            await Post.create({ title, caption, imageUrl, UserId: req.session.userId })
            res.redirect("/posts")
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map((e) => e.message)
                return res.render("addPost.ejs", { data: { title, caption, imageUrl }, errors })
            }
            res.send(error)
        }
    }

    static async editForm(req, res) {
        try {
            const { id } = req.params
            const post = await Post.findByPk(id)
            if (!post || !post.isUserBy(req.session.userId)) {
                return res.redirect("/posts")
            }

            res.render("editPost.ejs", { post, errors: [] })
        } catch (error) {
            res.send(error)
        }
    }

    static async editPost(req, res) {
        const { id } = req.params
        const { title, caption, imageUrl } = req.body
        try {
            const post = await Post.findByPk(id)
            if (!post || !post.isUserBy(req.session.userId)) {
                return res.redirect("/posts")
            }

            await post.update({ title, caption, imageUrl })
            res.redirect(`/posts/${id}`)
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map((e) => e.message)
                return res.render("editPost", { post: { id, title, caption, imageUrl }, errors })
            }
            res.send(error)
        }
    }

    static async deletePost(req, res) {
        try {
            const { id } = req.params
            const post = await Post.findByPk(id)

            if (!post || !post.isUserBy(req.session.userId)) {
                return res.redirect("/posts")
            }
            const title = post.title

            await post.destroy()
            res.redirect(`/posts?message=post ${encodeURIComponent(title)} has been deleted`)
        } catch (error) {
            res.send(error.message)
        }
    }
}

module.exports = PostsController