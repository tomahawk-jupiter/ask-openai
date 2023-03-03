const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = require('./comment');
const CommentSchema = Comment.schema;

const PostSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 240
    },
    answer: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 3000
    },
    comments: [CommentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);

/**
 * NOTES
 *
 * timestamps: true will add:
 * createdAt
 * updatedAt
 */
