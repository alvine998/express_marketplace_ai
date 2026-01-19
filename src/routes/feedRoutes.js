const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

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
 *                 example: Check out our new summer collection!
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 content:
 *                   type: string
 *                   example: Check out our new summer collection!
 *                 imageUrl:
 *                   type: string
 *                   example: https://storage.googleapis.com/bucket/feed.jpg
 *                 likesCount:
 *                   type: integer
 *                   example: 0
 *                 commentsCount:
 *                   type: integer
 *                   example: 0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, upload.single("image"), feedController.createPost);

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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       content:
 *                         type: string
 *                         example: Check out our new summer collection!
 *                       imageUrl:
 *                         type: string
 *                         example: https://storage.googleapis.com/bucket/feed.jpg
 *                       likesCount:
 *                         type: integer
 *                         example: 25
 *                       commentsCount:
 *                         type: integer
 *                         example: 10
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                             example: techstore
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 */
router.get("/", feedController.getAllPosts);

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
 *         description: Like status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post liked
 *                 isLiked:
 *                   type: boolean
 *                   example: true
 *                 likesCount:
 *                   type: integer
 *                   example: 26
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post("/:postId/like", auth, feedController.toggleLike);

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
 *                 example: Great collection! Love it!
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 postId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440001
 *                 userId:
 *                   type: string
 *                   example: 550e8400-e29b-41d4-a716-446655440002
 *                 content:
 *                   type: string
 *                   example: Great collection! Love it!
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post("/:postId/comments", auth, feedController.addComment);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your post
 *       404:
 *         description: Post not found
 */
router.delete("/:id", auth, feedController.deletePost);

module.exports = router;
