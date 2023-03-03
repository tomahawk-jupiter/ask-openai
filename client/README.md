# OpenAI Forum

A forum for opanAI responses and visitor comments.

## What It Does?

- Users can post questions to openai and a response will be returned.
- The question and response are both saved in a database so that they can be displayed for other visitors to see.
- Users can comment on the question/answer posts.
- Some mock posts are displayed if the api stops working

**NOTE**: the chatbot doesn't remember previous answers. Maybe I could improve this somehow so that users can have an ongoing conversation with it.

## Links

- [openai docs](https://openai.com/api/)
- [Vite](https://vitejs.dev/guide/)
- [Material UI](https://mui.com/material-ui/getting-started/installation/)

## What I Used

- Vite
- React
- Material UI
- OpenAI

See `NOTES.md` for more detailed notes about the process and what I learnt.

## How It Works

- When page first loads, it gets the previous question/answer posts from the DB
- When a new question is asked, it goes to the backend which gets an answer using the openai api.
- The post is saved in the DB, and also returned to the frontend.
- The id for this new post is passed to setNewPostId hook which triggers the useEffect that gets all posts again.
- When the posts load, the post that was just added is scrolled into view and the answer is "typed" using the useType function. This happens by comparing the newPostId to the posts id.
- When deleting a post, the id for the post is passed to setNewPostId to trigger another reload. The id has to be modified in some way otherwise it wont trigger a render if it was the last post that was added.

## Ideas for Improvements

- Adding a new post should not trigger another GET all posts, it should just add to the DB and return the new post which can be added to the posts in state. This is already how the comments are handled.
- Make it so the openai remembers previous answers so users can have an ongoing conversation.
