const express = require('express');
const router = express.Router();

const validators = require('../validators/validators');
const postController = require('../controllers/postController');

// POSTS //

/* GET all posts */
router.get('/', postController.all_posts);

/* POST a new question and return an answer */
router.post('/', validators.ask_question, postController.ask_question);

/* DELETE a post */
router.delete('/:postId', validators.delete_post, postController.delete_post);

// COMMENTS //

/* POST a comment on a question/answer post */
router.post('/:postId', validators.add_comment, postController.add_comment);

/* DELETE a comment */

router.delete(
  '/:postId/:commentId',
  validators.delete_comment,
  postController.delete_comment
);

/* TEST route: delay response */
router.get('/delay', postController.test_delay);

module.exports = router;
