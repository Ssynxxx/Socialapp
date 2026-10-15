const express = require('express');
const UserController = require('../controllers/UserController');
const isLoggedIn = require('../middleware/auth');
const PostsController = require('../controllers/PostsController');
const ProfileController = require('../controllers/ProfileController');
const router = express.Router();

// REGIS , LOGIN , LOGOUT
router.get('/', UserController.landing)
router.get('/register', UserController.registerForm)
router.post('/register', UserController.register)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.login)
router.get('/logout', UserController.logout)

router.use(isLoggedIn);

// POSTS
router.get('/posts', PostsController.posts)
router.get('/posts/add', PostsController.addForm)
router.post('/posts/add', PostsController.addPost)
router.get('/posts/:id', PostsController.detail)
router.get('/posts/:id/edit', PostsController.editForm)
router.post('/posts/:id/edit',  PostsController.editPost)
router.get('/posts/:id/delete', PostsController.deletePost)

// PROFILE
router.get("/profile/:id", ProfileController.profile)
router.get("/profile/add/:UserId", ProfileController.addForm)
router.post("/profile/add/:UserId", ProfileController.addProfile)


module.exports = router