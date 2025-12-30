const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/feed:
 *   post:
 *     summary: Create a new feed post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created
 */
router.post('/', auth, upload.single('image'), feedController.createPost);

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: Get all feed posts
 *     tags: [Feed]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', feedController.getAllPosts);

/**
 * @swagger
 * /api/feed/{postId}/like:
 *   post:
 *     summary: Toggle like for a post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status changed
 */
router.post('/:postId/like', auth, feedController.toggleLike);

/**
 * @swagger
 * /api/feed/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/:postId/comments', auth, feedController.addComment);

/**
 * @swagger
 * /api/feed/{id}:
 *   delete:
 *     summary: Delete own post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete('/:id', auth, feedController.deletePost);

module.exports = router;
