const { Comment, User } = require('../models');

exports.createComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const resourceId = req.params.id || req.body.resourceId;

    const newComment = await Comment.create({
      resourceId,
      userId: req.user.id,
      comment: commentText
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating comment' });
  }
};

exports.getResourceComments = async (req, res) => {
  try {
    const comments = await Comment.find({ resourceId: req.params.id, status: 'Visible' })
      .populate('userId', 'fullName');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching comments' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting comment' });
  }
};
