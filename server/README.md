# Ask OpenAI Backend

Backend api for my ask-openai frontend. I made some notes as I went along in [NOTES.md](NOTES.md).

To start: `$ yarn dev-start` or `$ yarn start`.

## What It Does?

- Receive questions from frontend
- Use the openai api to get an answer
- Store the questions and answers in database as a Post
- Send back the saved post
- Receive and store comments for individual Q/A posts
  - POST comment returns the newly saved comment
- Delete a Comment or Post
