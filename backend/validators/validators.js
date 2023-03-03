const { body, param } = require('express-validator');

/**** usage in route file ****/
// const validators = require('./validators');
// validators.ask_question

/**** usage in controller file *****/
// const { validationResult } = require('express-validator)
// const errors = validationResult(req); // put this inside the controller
// if (!errors.isEmpty()) { return res.status(422).json({errors: errors.array()})}

exports.ask_question = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is missing!')
    .isLength({ min: 1, max: 240 })
];

exports.delete_post = [
  param('postId').isAlphanumeric().isLength({ min: 24, max: 24 })
];

exports.add_comment = [
  body('commentText')
    .trim()
    .notEmpty()
    .withMessage('Comment text is missing!')
    .isLength({ min: 1, max: 240 }),
  param('postId').isAlphanumeric().isLength({ min: 24, max: 24 })
];

exports.delete_comment = [
  param('postId').isAlphanumeric().isLength({ min: 24, max: 24 }),
  param('commentId').isAlphanumeric().isLength({ min: 24, max: 24 })
];

// // Custom error message example
// check('password')
// .isLength({ min: 5 })
// .withMessage('must be at least 5 chars long')
// .matches(/\d/)
// .withMessage('must contain a number'),
