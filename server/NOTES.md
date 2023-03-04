# Ask OpenAI Backend Notes

Things I learnt, revised and looked up while writing this api.

## Contents

- [Links](#links)
- [Express Generator](#express-generator)
  - [Start Express in DEBUG mode](#start-express-in-debug-mode)
- [Mongoose Schema](#mongoose-schema)
  - [Database Schema Model Structure](#database-schema-model-structure)
  - [Nesting Schemas](#nesting-schemas)
  - [Schema Timestamps](#schema-timestamps)
- [Routes & Controllers](#routes--controllers)
- [params vs query](#params-vs-query)
- [Optional Chaining ?.](#optional-chaining)
- [Testing](#testing)
  - [Base URL Not Returning My Response?](#base-url-not-returning-my-response)
  - [Delay Action Test Route](#delay-action-test-route)
- [Status Codes](#status-codes)
- [Mongoose Connection](#mongoose-connection)
  - [Collections & Databases](#collections--databases)
  - [Connect If not in TEST mode](#connect-if-not-in-test-mode)
- [Mongoose Queries](#mongoose-queries)
  - [Find](#find)
  - [FindOneAndUpdate](#findoneandupdate)
  - [Dealing with Arrays in Mongoose](#dealing-with-arrays-in-mongoose)
- [Helmet Configuration](#helmet-configuration)
- [Express Validator](#express-validator)
  - [Sanitizers Available in express-validator](#sanitize-user-input-for-use-in-mongoose-queries)
  - [Express Validators in Seperate file](#express-validators-in-seperate-file)
  - [Mongo Sanitize](#mongo-sanitize)
  - [Helmet](#helmet)
- [OpenAI](#openai)
  - [OpenAI Playground](#openai-playground)
- [Prepare For Production](#prepare-for-production)
  - [Helmet](#helmet)
  - [Node Version in package.json](#node-version)
  - [Set NODE_ENV to 'production'](#set-node_env-to-production)
  - [Create a Procfile](#create-a-procfile)

## Links

Some useful resources:

- [Express Local Library repo](https://github.com/mdn/express-locallibrary-tutorial)
- [MDN Express Local Library Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website)
- [Article: express api jest testing](https://www.makeuseof.com/express-apis-jest-test/)
- [Sanitizer Descriptions (used in express-validator)](https://github.com/validatorjs/validator.js#sanitizers)
- [Validation in seperate file (StackOverflow)](https://stackoverflow.com/questions/55772477/how-to-implement-validation-in-a-separate-file-using-express-validator)
- [OpenAI Examples Here](https://platform.openai.com/examples)

## Express Generator

Create the express boilerplate without a view/template engine and include a .gitignore file:

`$ npx express-generator --no-view --git my-app`

Delete the public folder and its contents as I'm just making a rest api and won't need it.

### Start Express in DEBUG mode

Debug is like an augmented version of console.log, but unlike console.log, you don't have to comment out debug logs in production code. Logging is turned off by default and can be conditionally turned on by using the DEBUG environment variable.

```
"start": "node ./bin/www",
"dev-start": "DEBUG=ask-openai-backend:* yarn start",
```

[Page Top](#contents)

## Mongoose Schema

### Database Schema Model Structure

Linking, Embedding, Buckets, Two way Embedding. One-to-one, one-two-many, many-to-many.

#### Embedding

Embedding is where you nest data in the same document. Its good for when there aren't too many entries to be embedded. If there are than linking would be better.

```js
{
  postId: 1,
  text: "hello",
  comments: [
    {
      commentId: 1,
      text: "hi"
    }
  ]
}
```

#### Linking

Linking is where you use a foreign key to link two documents together:

```js
// Post document
{
  postId: 1,
  text: "hello",
  comments: [
    1
  ]
}
// Comment document
{
  commentId: 1,
  text: "hi"
}
```

#### Buckets

This is a hybrid of the two. It stores the comments in blocks, say 50. Theres a post document, then a document for every 50 comments. This allows you to retrieve the comments in blocks, useful for if you have say, 50 comments per page.

**When to use bucketing**

When you have the possibility of splitting up your documents in discreet batches it makes sense to consider bucketing to speed up retrieval of documents.

Typical cases are things like bucketing data by hours, days or number of entries on a page (such as comments pagination).

#### Two Way Embedding

**NOTE**: Should this be called two way linking?

Think books and authors. An author can have multiple books and a book can have multiple authors.

Each author doc has foreign keys for book docs and vice versa.

[Page Top](#contents)

### Nesting Schemas

Mongoose schemas can be nested in other schemas either singly or in an array. You can import a model and access its schema so that you can keep each schema / model in its own file.

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment'); // import Comment Model
const CommentSchema = Comment.schema; // access the Comment schema

const PostSchema = new Schema(
  {
    question: {
      type: String
    },
    comments: [CommentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
```

### Schema Timestamps

Include `{ timestamps: true }` as an option and mongoose will add `createdAt` and `updatedAt` date fields. There are other options you can add too.

```js
new Schema({..}, options);

// or
const schema = new Schema({..});
schema.set(option, value);
```

### maxLength

1000 characters is 150 words. Its probably a good idea to put a limit on the character count.

[Page Top](#contents)

## Routes & Controllers

A route is a section of Express code that associates an HTTP verb (GET, POST, PUT, DELETE, etc.), a URL path/pattern, and a function that is called to handle that pattern. The functions, also are known as **controllers**, can be seperated into their own files/folder. This is where we deal with interacting with the database via the models.

**PUT**: is for updating data? **POST** is for adding new data?

## params vs query

These are two fields available on the request object. They are for passing data through the URL.

### Params

params is an object inside the request object. Example:

From the route: `/lor/creatures/:name`.

We make a request `/lor/creatures/gollum`.

We get `req.params.name ==  "gollum"`.

```js
{
  params: {
    name: 'gollum'
  },
...
}
```

### Query

Query is also an object inside the request object. It contains the data from any query strings in the URL.

From the route: `/lor/creatures/:name`.

We make a request and include a query string: `/lor/creatures/hobbit?familyname=Baggins&home=Shire`.

We get `req.params.name ==  "hobbit"` and `req.query.familyname == "Baggins"` and `req.query.home == "Shire"`.

```js
// req object
{
  params: {
    name: 'hobbit'
  },
  query: {
    familyname: 'Baggins',
    home: 'Shire'
  }
}
```

[Page Top](#contents)

## Optional Chaining ?.

Use this to access an objects property or function when the object might not exist and if it doesn't return undefined instead of throwing an error.

```js
// Example
const animales = {
  cat: {
    name: 'Sprout'
  }
};
animals.dog?.name; // undefined
```

[Page Top](#contents)

## Testing

Add jest (testing) and supertest (http testing) as dev dependencies:

`$ yarn add --dev jest supertest`

Add a script to package.json:

`"test": "jest"` or `"test": "jest --verbose"` for verbose output.

- Test files must be named `filename.test.js`.
- Require your `app` instance into your test file.
- Require supertest and pass it your app instance.
- The supertest instance is used to test your routes, ie. GET, POST etc.
- Use jest to write your tests.

Tests shouldn't rely on each other, populate the data for each test rather than relying on previous tests to add the data.

You can setup a seperate database and connection for the tests.

### Base URL Not Returning My Response

The base url (`localhost:3000/`) was returning html from the public folder (part of the boilerplate) instead of my route/controller.

I deleted this folder and now it points to my route/controller. But why was it doing this? Was it because the file was called `index.html`?

### Delay Action Test Route

There is a GET route `/delay` which responds after a few second delay. This is to help when adding a loading icon in the frontend.

[Page Top](#contents)

## Status Codes

- 200 ok: for GET, POST or DELETE success
- 204: for POST or DELETE success that returns no data
- 403: valid url is forbidden to client

The five classes include:

- 100s: Informational codes indicating that the request initiated by the browser is continuing.
- 200s: Success codes returned when browser request was received, understood, and processed by the server.
- 300s: Redirection codes returned when a new resource has been substituted for the requested resource.
- 400s: Client error codes indicating that there was a problem with the request.
- 500s: Server error codes indicating that the request was accepted, but that an error on the server prevented the fulfillment of the request.

[Page Top](#contents)

## Mongoose Connection

Mongodb connection string:

`mongodb+srv://${username}:${password}@${clusterName}.psiey.mongodb.net/${datbaseName}?retryWrites=true&w=majority`

**NOTE**: Use environmental variables to get values to fill in the string.

**DEBUG TIP**: Console.log `mongoose.connection` and look for the connection string to make sure the variables have been passed in. This helped me realise I wasn't loading in .env variables properly.

### Collections & Databases

A database contains collections, collections contain documents.

**NOTE**: I couldn't drop the database, error said user can't do action. I loop through collections and drop instead.

```js
const mongoose = requires('mongoose');
mongoose.connect(connectionString);
const allCollections = mongoose.connection.collections;
const currentDatabase = mongoose.connection.db.databaseName;
await mongoose.connection.db.dropDatabase();
await mongoose.connection.collections[collectionName].drop();
```

### Connect If not in TEST mode

**NOTE**: Got this from my `jupiter-book` repo.

You can include this if you also have a test database in your tests and don't want to connect to your production database while running tests:

```js
dotenv.config();
// Connect to db only if not in test mode
if (!process.env.TEST) {
  mongoose.connect(process.env.MONGO_URI, () => {
    console.log('Connected to MongoDB');
  });
}
```

[Page Top](#contents)

## Mongoose Queries

You don't need to use `query.exec()` when using await. See the Find example below.

### Find

```js
// find all posts, sort by createdAt field ascending, limit docs by 30, execute.

// Using exec and callback
const result = Post.find({})
  .sort({ createdAt: 'asc' })
  .limit(30)
  .exec(callback);

// Using await
const result = await Post.find({}).sort({ createdAt: 'asc' }).limit(30);
```

### FindOneAndUpdate

`FindOneAndUpdate()` can be used instead of `save()`, you can add options that will create the document if it doesn't exist.

```js
const query = {},
  update = { expire: new Date() },
  options = { upsert: true, new: true, setDefaultsOnInsert: true };

// Find the document
Model.findOneAndUpdate(query, update, options, function (error, result) {
  if (error) return;
  // do something with the document
});
```

### Dealing with Arrays in Mongoose

```js
// Add to an array, in this case its a doc created using a mongoose model
await Post.findByIdAndUpdate(
  postId,
  {
    $push: { comments: newComment }
  },
  { returnDocument: 'after' }
);

// Remove a specific doc from array
await Post.findByIdAndUpdate(
  postId,
  {
    $pull: {
      comments: { _id: commentId }
    }
  },
  { returnDocument: 'after' }
);
```

[Page Top](#contents)

## Express Validator

`$ yarn add express-validator`

`check()` will look for fields in the following request objects: body, cookies, headers, params, query.

I you want to just check a specific one, you can use `body()`, `params()`, etc.

```js
// Basic Example
const { body, validationResult } = require('express-validator');

app.post(
  '/user',
  body('username').isEmail(),
  body('password').isLength({ min: 5 }),
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Passes validation - do stuff
  }
);
```

### Schema Validation

- [Schema Syntax](https://express-validator.github.io/docs/schema-validation)

This is another synax you can use. It looks like it would be a better way to do it, particularly for more complex validation cases.

### Sanitizers Available in express-validator

- [Sanitizers docs](https://github.com/validatorjs/validator.js#sanitizers)
- [blacklist help stackoverflow](https://stackoverflow.com/questions/69215308/how-to-use-the-blacklist-method-from-express-validator)

Useful sanitizers:

- blacklist(): remove characters your don't want
- escape(): escape html characters
- trim(): trim whitespace

### Express Validators in Seperate file

The validators are in `validators/validators.js`, import them into `routes/posts.js` and put them on the routes before the controller functions.

Pass the `validationResult` (from express-validator) into the controller file to access the result of the validation inside your controller functions.

### Mongo Sanitize

- [mongo-sanitize](https://www.npmjs.com/package/mongo-sanitize)

The sanitize function will strip out any keys that start with '$' in the input, so you can pass it to MongoDB without worrying about malicious users overwriting query selectors.

```js
var sanitize = require('mongo-sanitize');
var clean = sanitize(req.params.username); // prevents query injections

Users.findOne({ name: clean }, function (err, doc) {
  // ...
});
```

[Page Top](#contents)

## OpenAI

### OpenAI Playground

[OpenAI Examples Here](https://platform.openai.com/examples). NOTE: You need to be logged in to access the playground.

The example used in the vid is `Natural Language to OpenAI API`. Find it in the examples page and click on it, there should be a button to open the example in the playground.

### Setup an Openai Instance

```js
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openaiInstance = new OpenAIApi(configuration);

module.exports = openaiInstance;
```

### OpenAI API Usage Example

**max_tokens**: This is to do with the length of the response. In the playground it says 1 token is roughly 4 normal english text characters.

```js
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});
```

[Page Top](#contents)

## Prepare For Production

### Helmet

Helmet helps you secure your Express apps by setting various HTTP headers.

From my `jupiter-book` project repo. These were the configurations to get that project working, it took some figuring out! But helmet with all the defaults `app.use(helmet())` might work for this project.

```js
app.use(cors());
// app.use(helmet()); // use helmet with defaults

app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'cloudflare-ipfs.com', 'res.cloudinary.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  })
);
```

[Page Top](#contents)

### Node Version

Add this to package.json.

```json
"engines": {
  "node": "18.12.0"
}
```

### Set NODE_ENV to 'production'

By default its set to 'development', changing it to 'production' will:
Remove stack traces in error pages.
Caches view templates and CSS files generated from CSS extensions.
This can improve performance by a factor of three!

This change can be made either by using export, an environment file, or the OS initialization system.

## Create a Procfile:

Create a `procfile` (no extension) and put in: `web: node ./bin/www`.

**Note**: no longer required. If not included heroku (and maybe other tools?) looks for start script.

[Page Top](#contents)
