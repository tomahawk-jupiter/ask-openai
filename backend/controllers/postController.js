const Post = require('../models/post');
const Comment = require('../models/comment');

const { validationResult } = require('express-validator');
const openaiInstance = require('../openaiInstance');

// GET
exports.all_posts = async (req, res) => {
  try {
    const result = await Post.find({}).sort({ createdAt: 'asc' }).limit(30);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
};

// POST
exports.ask_question = async (req, res) => {
  const errors = validationResult(req);

  return res.status(500).json({ message: 'test 500 error.' }); // TEST

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((errObj) => errObj.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const question = req.body.question;
  // let answer; // TEST

  /**
   * TODO: use the openai api to get an answer for the question.
   */

  // TEST DEBUG
  // try {
  //   const prompt = question;

  //   const response = await openaiInstance.createCompletion({
  //     model: 'text-davinci-003',
  //     prompt: `${prompt}`,
  //     temperature: 0,
  //     max_tokens: 500,
  //     top_p: 1,
  //     frequency_penalty: 0.5,
  //     presence_penalty: 0
  //   });

  //   answer = response.data.choices[0].text;
  // } catch (error) {
  //   console.log({ openAiError: error });
  //   return res.status(500).json({ error: 'OpenAI request failed!' });
  // }

  const answer = 'my favourite colour is blue'; // TEST

  const newPost = new Post({
    question,
    answer
  });

  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
};

// DELETE
exports.delete_post = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // const errorMessages = errors.array().map((errObj) => errObj.msg);
    return res.status(400).json({ error: 'Invalid post id format!' });
  }
  const id = req.params.postId;

  let result;
  try {
    result = await Post.findByIdAndDelete(id);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'something went wrong! Unable to delete post.' });
  }

  if (!result) {
    return res.status(400).json({ error: 'Post not found!' });
  }
  return res.status(200).json(result); // success
};

// POST
exports.add_comment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((errObj) => errObj.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const postId = req.params.postId;
  const commentText = req.body.commentText;

  const newComment = new Comment({ text: commentText });

  try {
    const addCommentToPostResult = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment }
      },
      { returnDocument: 'after' }
    );

    if (!addCommentToPostResult) {
      return res.status(400).json({ error: 'Post not found!' });
    }

    return res.status(200).json(newComment);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
};

// DELETE
exports.delete_comment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // const errorMessages = errors.array().map((errObj) => errObj.msg);
    return res
      .status(400)
      .json({ error: 'Invalid post or comment id format!' });
  }

  const { postId, commentId } = req.params;

  try {
    const removeCommentResult = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: { _id: commentId }
        }
      },
      { returnDocument: 'after' }
    );

    return res.status(200).json({ message: 'Comment successfully removed!' });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
};

// TEST Delay
exports.test_delay = (req, res) => {
  setTimeout(() => {
    return res.status(200).json({ message: 'Success' });
  }, 5000);
};
