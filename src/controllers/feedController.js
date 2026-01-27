const FeedPost = require("../models/FeedPost");
const FeedLike = require("../models/FeedLike");
const FeedComment = require("../models/FeedComment");
const { uploadImageToFirebase } = require("../utils/firebaseUtils");
const { getPagination, getPagingData } = require("../utils/paginationUtils");
const { logActivity } = require("../utils/loggingUtils");
const sequelize = require("../config/database");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToFirebase(req.file);
    }

    const post = await FeedPost.create({
      userId,
      content,
      imageUrl,
    });

    await logActivity(req, "CREATE_FEED_POST", { postId: post.id });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { limit: l, offset } = getPagination(page, limit);

    const data = await FeedPost.findAndCountAll({
      limit: l,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        "user",
        { model: FeedLike, as: "likes" },
        { model: FeedComment, as: "comments", include: ["user"] },
      ],
      distinct: true,
    });

    const response = getPagingData(data, page, l);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching feed" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existingLike = await FeedLike.findOne({ where: { userId, postId } });

    if (existingLike) {
      await existingLike.destroy();
      await logActivity(req, "UNLIKE_POST", { postId });
      return res.status(200).json({ message: "Post unliked" });
    } else {
      await FeedLike.create({ userId, postId });
      await logActivity(req, "LIKE_POST", { postId });
      return res.status(201).json({ message: "Post liked" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling like" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await FeedComment.create({
      userId,
      postId,
      content,
    });

    await logActivity(req, "ADD_FEED_COMMENT", {
      postId,
      commentId: comment.id,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding comment" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await FeedPost.findByPk(req.params.id);

    if (!post || post.userId !== req.user.id) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    await logActivity(req, "DELETE_FEED_POST", { postId: req.params.id });

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
};
