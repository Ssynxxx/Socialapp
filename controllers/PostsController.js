const { Post, Tag } = require("../models")

// id tag dari checkbox bisa string tunggal, array, atau kosong
const toTagIds = (value) => [].concat(value || [])

class PostsController {
    static async posts(req, res) {
        try {
            const { search, sort, tag, notif, error } = req.query

            const [posts, tags] = await Promise.all([
                Post.searchAndSort({ search, sort, tag }),
                Tag.findAll({ order: [['name', 'ASC']] })
            ])

            res.render("posts.ejs", {
                posts,
                tags,
                search: search || '',
                tag: tag || '',
                notif: notif || null,
                error: error || null
            })
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

            res.render("detail", { post })
        } catch (error) {
            res.send(error)
        }
    }

    static async addForm(req, res) {
        try {
            const tags = await Tag.findAll({ order: [['name', 'ASC']] })
            res.render("addPost.ejs", { data: {}, tags, selected: [], errors: [] })
        } catch (error) {
            res.send(error)
        }
    }

    static async addPost(req, res) {
        const { title, caption, imageUrl } = req.body
        const tagIds = toTagIds(req.body.tagIds)
        try {
            const post = await Post.create({ title, caption, imageUrl, UserId: req.session.userId })
            await post.setTags(tagIds)
            res.redirect("/posts")
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map((e) => e.message)
                const tags = await Tag.findAll({ order: [['name', 'ASC']] })
                return res.render("addPost.ejs", {
                    data: { title, caption, imageUrl },
                    tags,
                    selected: tagIds.map(Number),
                    errors
                })
            }
            res.send(error)
        }
    }

    static async editForm(req, res) {
        try {
            const { id } = req.params
            const post = await Post.getById(id)
            if (!post || !post.isUserBy(req.session.userId)) {
                return res.redirect("/posts")
            }

            const tags = await Tag.findAll({ order: [['name', 'ASC']] })
            res.render("editPost.ejs", {
                post,
                tags,
                selected: post.Tags.map((t) => t.id),
                errors: []
            })
        } catch (error) {
            res.send(error)
        }
    }

    static async editPost(req, res) {
        const { id } = req.params
        const { title, caption, imageUrl } = req.body
        const tagIds = toTagIds(req.body.tagIds)
        try {
            const post = await Post.findByPk(id)
            if (!post || !post.isUserBy(req.session.userId)) {
                return res.redirect("/posts")
            }

            await post.update({ title, caption, imageUrl })
            await post.setTags(tagIds)
            res.redirect(`/posts/${id}`)
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map((e) => e.message)
                const tags = await Tag.findAll({ order: [['name', 'ASC']] })
                return res.render("editPost", {
                    post: { id, title, caption, imageUrl },
                    tags,
                    selected: tagIds.map(Number),
                    errors
                })
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
            res.redirect(`/posts?notif=${encodeURIComponent(`Post "${title}" berhasil dihapus`)}`)
        } catch (error) {
            res.send(error.message)
        }
    }
}

module.exports = PostsController
