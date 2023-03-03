const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 240
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);

/**
 * NOTES
 *
 * timestamps: true will add:
 * createdAt
 * updatedAt
 */
