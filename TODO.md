## Ask OpenAI TODO

- [Frontend TODOs](#frontend)
- [Backend TODOs](#backend)
- [Debugging](#debugging)

## Frontend

- ✅ useEffect & axios
- ✅ data structure/field names.
- ✅ connect post input to api using axios
- ✅ Rerender with useEffect to getAllPosts again
- ✅ Auto focus question input
- ✅ Scroll to the newly added post
- ✅ connect comment input to api
- ✅ Use typewriter effect for answer
- ✅ Color sheme switch, light and dark.
- ✅ Fixed header section
- ✅ Toggle help panel
- ✅ Delete post button UI
- ✅ Functional no/yes buttons
- ✅ Delete post connect api
- ✅ Flash message
- ✅ Write a test api route that waits 5 seconds then returns success message
- ✅ Loading icon while waiting for openai response
- ✅ Loading icon while waiting for get all posts
- ✅ Allow new lines in question input, ie. don't submit on enter.
- ✅ handle question post failure
- ✅ Reuse the flash message by passing in a message and type ie. success/error.
- ✅ Input validation, prevent whitespace only being submitted
- TODO: Append newpost response to posts state to avoid get_all posts.
- TODO: TEST post question with openAI api connected
- TODO: Fix comment input for below 355px width.
- TODO: TURN REACT STRICT MODE back on before production / build IMPORTANT
- TODO: Host on github pages. Look up the command I used before for adding a pages branch.
- TODO: Refactor / structure components folder.

## Extras

- Toggle most recent first or newest first - use an MUI switch

**NOTE**: I copied some configuration examples into `axios.config.js` (in frontend ie. `ask-openai` folder).

## Backend

- ✅ Mongoose Schema
- ✅ Routes Skeleton
- ✅ Controller mockups
- ✅ Write TESTs for skeleton routes
- ✅ Connect test DB to tests
- ✅ necessary tests and controllers complete
- ✅ Route validation and sanitation with express-validator
- ✅ Connect DB in app
- TODO: prepare for production: look up my old notes.
  - ✅ cors
  - ✅ helmet: added with defaults. Might need to customize.
  - production mode / node version
  - Cleanup console.logs
- TODO: Connect openai api in the POST question route (do near to last)
- TODO: Host on Render: host api first as will need the URL to put in the frontend

**QUESTIONS**: What is morgan? Logger?

Possible Packages to use:

- [cors](https://www.npmjs.com/package/cors)
- [helmet](https://helmetjs.github.io/) html header security
- [mongoose](https://mongoosejs.com/) or mongodb (don't need both?)
- [express validator](https://express-validator.github.io/docs/)
- [async](https://caolan.github.io/async/v3/) helps with multiple DB queries
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest#readme)
- [OpenAI Docs: Examples](https://platform.openai.com/examples)

Frontend:

- [Luxon](https://moment.github.io/luxon/#/?id=luxon) format dates.
- [axios](https://axios-http.com/)

Tools:

- [Postman](https://www.postman.com/) for testing api's

## Debugging

I'm getting this in the console when clicking the add new post button: `Element.setCapture() is deprecated. Use Element.setPointerCapture() instead. For more help https://developer.mozilla.org/docs/Web/API/Element/setPointerCapture`. It seems to only happen when in firefox responsive design mode.

## Style Debug

- The comment input starts looking dodgy at 355px width.
