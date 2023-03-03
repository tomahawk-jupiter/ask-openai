const request = require('supertest');
const app = require('../app');
const { setupTestDB } = require('./setupTestDB');

// require('dotenv').config();
// const TEST = process.env.TEST || false;

// jest.setTimeout(10000); // applies to tests in this file only

const mockPost = {
  question: 'what is your favourite colour?',
  answer: 'my favourite colour is blue',
  comment: {
    text: 'this is a comment'
  }
};

describe('TESTS', () => {
  const testDB = 'openaiForumTest';
  setupTestDB(testDB); // setup & teardown test database

  describe('#0. Pre test', () => {
    it('true is true', () => {
      expect(true).toBe(true);
    });
  });

  describe('#1. GET / -all posts', () => {
    let response;

    beforeAll(async () => {
      const questionResponse = await request(app)
        .post('/')
        .send({ question: mockPost.question });
      mockPost.id = questionResponse.body._id;

      response = await request(app).get('/');
    });
    afterAll(async () => {
      await request(app).delete(`/${mockPost.id}`);
    });

    it('should return 200', () => {
      expect(response.statusCode).toBe(200);
    });
    it('should contain at least one post document', () => {
      expect(response.body.length > 0).toBe(true);
    });
    it('document includes a question and answer', () => {
      expect(response.body[0].question).toBe(mockPost.question);
      expect(response.body[0].answer).toBe(mockPost.answer);
    });
  });

  describe('#2. POST / -send a question', () => {
    let response; // TODO: does this need to be outside the beforeAll block?
    beforeAll(async () => {
      response = await request(app)
        .post('/')
        .send({ question: mockPost.question });
      mockPost.id = response.body._id;
    });
    afterAll(async () => {
      await request(app).delete(`/${mockPost.id}`);
    });

    it('should return 200', () => {
      expect(response.statusCode).toBe(200);
    });
    it('should return the id for the new post saved in DB', () => {
      expect(response.body._id).toBeTruthy();
    });
    it('should return the correct answer', () => {
      expect(response.body.answer).toBe(mockPost.answer);
    });
  });

  describe('#3. POST / -send an empty question', () => {
    let response;
    beforeAll(async () => {
      response = await request(app).post('/').send({ question: '' });
    });
    it('should return 400 status', () => {
      expect(response.statusCode).toBe(400);
    });
    it('should return failure message', () => {
      expect(response.body.errors).toContainEqual(
        expect.stringContaining('missing')
      );
    });
  });

  describe('#4. DELETE /:postId -remove a post', () => {
    beforeAll(async () => {
      // Add test data and save the ids for the tests
      const response = await request(app)
        .post('/')
        .send({ question: mockPost.question });
      mockPost.id = response.body._id;
    });

    it('should fail when id not found', async () => {
      const response = await request(app).delete(
        `/${'111111111111111111111111'}`
      );
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(
        expect.stringContaining('Post not found')
      );
    });

    it('should fail when invalid id format', async () => {
      const response = await request(app).delete(
        `/${'11111111#111111111111111'}`
      );
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(expect.stringContaining('Invalid'));
    });

    it('should return 200', async () => {
      const response = await request(app).delete(`/${mockPost.id}`);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('#5. POST /:postId -add a comment to a post', () => {
    // TODO: afterAll() cleanup the added comment to keep tests isolated
    let commentResponse;

    beforeAll(async () => {
      const postResponse = await request(app)
        .post('/')
        .send({ question: mockPost.question });
      mockPost.id = postResponse.body._id;

      commentResponse = await request(app)
        .post(`/${mockPost.id}`)
        .send({ commentText: mockPost.comment.text });
      mockPost.comment.id = commentResponse.body._id;
    });
    afterAll(async () => {
      await request(app).delete(`/${mockPost.id}`);
    });

    it('should return 200', () => {
      expect(commentResponse.statusCode).toBe(200);
    });
    it('should return an id for the comment', () => {
      expect(commentResponse.body._id).toBeTruthy();
    });
    it('should return comment text', () => {
      expect(commentResponse.body.text).toBe(mockPost.comment.text);
    });
  });

  describe('#6. DELETE /:postId/:commentId -remove a comment from a post', () => {
    beforeAll(async () => {
      const postResponse = await request(app)
        .post('/')
        .send({ question: mockPost.question });

      mockPost.id = postResponse.body._id;

      const commentResponse = await request(app)
        .post(`/${mockPost.id}`)
        .send({ commentText: mockPost.comment.text });

      mockPost.comment.id = commentResponse.body._id;
    });
    afterAll(async () => {
      await request(app).delete(`/${mockPost.id}`);
    });

    it('should return 200', async () => {
      const response = await request(app).delete(
        `/${mockPost.id}/${mockPost.comment.id}`
      );
      expect(response.statusCode).toBe(200);
    });
    it('should no longer exist in the posts comments array after successful delete', async () => {
      const allPostsResponse = await request(app).get('/');

      expect(allPostsResponse.body[0].comments.length).toBe(0);
    });
  });
});
