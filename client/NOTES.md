# Ask OpenAI Frontend Notes

After Vite, React and MUI are installed the boilerplate is 83 MB.

## Contents

- [Links](#links)
- [Setup Boilerplate With Vite](#setup-boilerplate-with-vite)
- [Install Material UI](#install-material-ui)
  - [Roboto Font](#roboto-font)
  - [Icons](#icons)
  - [Custom Theme](#custom-theme)
- [Customize MUI Component](#customize-mui-component)
  - [MUI Docs Example](#mui-docs-example)
  - [Emotion Docs Example](#emotion-docs-example)
- [Form Popover attached to Floating Button](#form-popover-attached-to-floating-button)
- [Handling Input Element With React](#handling-input-element-with-react)
  - [I Removed Submit on Enter key for Question](#i-removed-submit-on-enter-key-for-question)
  - [Blur Input Using Ref](#blur-input-using-ref)
  - [Input validation with trim()](#input-validation-with-trim)
- [Fetch vs Axios](#fetch-vs-axios)
- [Axios](#axios)
  - [Axios Timeout Example](#axios-timeout-example)
  - [Axios Instance](#axios-instance)
  - [Cross Origin Error](#cross-origin-error)
- [Issues](#issues)
  - [Dialog Close not working with onKeyDown](#dialog-close-not-working-with-onkeydown)
  - [useEffect renders twice](#useeffect-renders-twice)
- [Scroll Into View](#scroll-into-view)
- [Loading Icon](#loading-icon)
- [Debugging](#debugging)

## Links

- [Vite](https://vitejs.dev/guide/)
- [Material UI](https://mui.com/material-ui/getting-started/installation/)
  - [useMediaQuery](https://mui.com/material-ui/react-use-media-query/)
  - [click-away listener](https://mui.com/material-ui/react-click-away-listener/)
  - [Floating action button](https://mui.com/material-ui/react-floating-action-button/)
  - [Material UI Colors](https://mui.com/material-ui/customization/color/)
  - [Default Theme](https://mui.com/material-ui/customization/default-theme/)
- [normalize.css](https://github.com/necolas/normalize.css)
- [Axios vs Fetch article](https://blog.logrocket.com/axios-vs-fetch-best-http-requests/)
- [Openai examples (Look at Natural language to OpenAI API)](https://platform.openai.com/examples)

## Setup Boilerplate With Vite

Use [vite](https://vitejs.dev/guide/) to setup the boilerplate using the `react` template.

Vite uses `rollup`, not webpack. Apparently it takes longer to create the build but its a smaller bundle.

```
$ yarn create vite ask-openai --template react
$ cd ask-openai
$ yarn
$ yarn dev
```

**NOTE**: Yarn can be installed using npm if you don't have it:

`$ npm install --global yarn`

**NOTE**: There was some simple but cool css in the boilerplate.

[Page Top](#contents)

## Install Material UI

**NOTE**: I got all these instructions from their site.

### Option 1

`$ yarn add @mui/material @emotion/react @emotion/styled`

### Option 2

It can alternatively be installed using styled components instead of emotion.

`yarn add @mui/material @mui/styled-engine-sc styled-components`

### Roboto Font

Material UI is designed to use Roboto font by default. Add it with:

#### Option 1: Install

`$ yarn add @fontsource/roboto`

Then you can import it in your entry point like this:

```js
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
```

#### Options 2: CDN

Put this in your projects `<head>` tags.

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>
```

### Icons

To use the font Icon component or the prebuilt SVG Material Icons (such as those found in the icon demos), you must first install the Material Icons font. You can do so with npm or yarn, or with the Google Web Fonts CDN.

#### Option 1: Install

`$ yarn add @mui/icons-material`

#### Options 2: CDN

Put this in your projects `<head>` tags.

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
```

[Page Top](#contents)

### Custom Theme

Wrap the theme provider around your app and pass it a theme object.

```js
// be sure to import from the correct place, the auto complete got them from the wrong place when I first did it
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
```

**CssBaseline**: is similar to `normalize.css` which is for normalizing html element and attribute styles. CssBaseline is scoped to where you put it rather than globally which the docs say is useful if progressively migrating a website to MUI.

[Page Top](#contents)

## Customize MUI Component

### MUI Docs Example

The `theme` argument allows you to access styles from the theme.

```js
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

const FloatFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  color: theme.palette.success.main,
}));

// use in react component
return (
  <FloatFab>
    <AddIcon />
  </FloatFab>
);
```

### Emotion Docs Example

```js
import styled from "@emotion/styled";

const Basic = ({ className }) => <div className={className}>Some text</div>;

const Fancy = styled(Basic)`
  color: hotpink;
`;

render(<Fancy />);
```

[Page Top](#contents)

## Material UI Colors

Hue & Shade: A single color within the palette is made up of a hue such as "red", and shade, such as "500". "red 50" is the lightest shade of red (pink!), while "red 900" is the darkest. In addition, most hues come with "accent" shades, prefixed with an A.

```js
import { deepOrange, deepPurple } from "@mui/material/colors";
<Avatar sx={{ bgcolor: deepOrange[500] }}>Q</Avatar>;
```

[Page Top](#contents)

## Form Popover attached to Floating Button

A floating button that opens a form input popover.

Used the `FormDialog` component. Replaced the original button with the `FabButton` component. Passed the `handleClickOpen` as a prop into the FabButton so I could put it in an onClick on the `FloatFab` component.

[Page Top](#contents)

## Handling Input Element With React

Use `onChange` event to handle the input element's value via useState hook.

Use `onKeyDown` event to submit the input if the `Enter` key is pressed.

### I Removed Submit on Enter key for Question

Being able to include newlines can be important in OpenAI prompts. I removed the ability to submit the question with enter key. This is what I removed:

```js
// formDialog.jsx
const handleSubmit = (e) => {
  if (e.code === "Enter" && input.length > 0) {
    postNewQuestion();
    setInput("");
    handleClose();
  }
};

<TextField onKeyUp={handleSubmit} />;
```

### Blur Input Using Ref

Blur the input. Use a ref on the TextField. The input is nested 2 levels in. `blur()` is the opposite of focus.

```js
const commentInput = useRef(); // useRef hook
<TextField ref={commentInput} />; // place the ref
commentInput.current.children[1].children[0].blur(); // use the ref
```

### Input validation with trim()

This can be used to remove white space at the start and end of a string but keeps any in the middle. Useful for input validation.

[Page Top](#contents)

## Fetch vs Axios

Fetch is a built-in API available in most modern browsers. Axios is a library that uses `XMLHttpRequest` under the hood.

Axios has a simpler syntax and, because it uses XMLHttpRequest, is backwards compatable with older browsers.

If you want to use Fetch and also be backward compatible you can use a poly-fill like `whatwg-fetch`.

[This article](https://blog.logrocket.com/axios-vs-fetch-best-http-requests/) shows how to achieve some of the axios features using `Fetch`.

## Axios

### Axios Timeout Example

```js
axios({
  method: "post",
  url: "/login",
  timeout: 4000, // 4 seconds timeout
  data: {
    firstName: "David",
    lastName: "Pollock",
  },
})
  .then((response) => {
    /* handle the response */
  })
  .catch((error) => console.error("timeout exceeded"));
```

### Axios Instance

```js
const instance = axios.create({
  baseURL: "https://some-domain.com/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
```

[Page Top](#contents)

### Cross Origin Error

Add cors to the backend:

```js
const cors = require("cors");
app.use(cors());
```

## Issues

### Dialog Close not working with onKeyDown

The MUI Dialog component wasn't closing when submitting with the onKeyDown. I changed it to onKeyUp and now it works

### useEffect renders twice

[Got this info here](https://flaviocopes.com/react-useeffect-two-times/). It shows how to turn off strict mode in the vite, nextjs and create react app boilerplates.

This happens in react 18 but only in development mode. It doesn't happen in production aparently.

The only way to disable this behavior is to disable strict mode.

Strict mode is important so this is a temporary workaround until you can fix any issue this change introduced.

[Page Top](#contents)

## Scroll into View

[Helpful article](https://bosctechlabs.com/scroll-to-an-element-in-react/#Scroll_to_an_Element_With_the_ElementscrollIntoView_Method_in_React)

`element.scrollIntoView()` can be used to scroll the parent container so that the element is in view. I can use this to put the new post into view after user posts a new question.

```js
.scrollIntoView({
  behavior: "smooth",
});
```

### Achieving this

The post request for the new question will return the DB id. Pass this value back from child (FormDialog) to parent (App) element that has it in state. Use this state value as a dependency in a useEffect hook which will getElementById using the new id then scrollIntoView this element.

This didn't work though. The getElement returns null, the element with that id must not be rendered when the useEffect runs.

I achieved the desired effect by passing the newPostId, that the App component receives from the FormDialog, to the Post component (of which there is one for each post). The Post component has a useEffect which has an if statement that compares the id for the component to the passed in postId. If they match, getElementById and scrollIntoView.

This works but the useEffect runs for every Post component every time the App renders. Is this excessive?

[Page Top](#contents)

## Loading Icon

I created a route in the api that responds after a 5 second delay. This can be used to add an artificial delay to test out the loading icon.

There are two loading icons.

1. Waiting for there to be posts in state, the initial value of posts is set to null. The loading icon is displayed until posts is truthy, ie. useEffect axios request gets them and puts in posts state value.
2. Waiting for a response to a question. For this I added a new state variable, loading, it will be true or false and when true, the loading icon is displayed.

[Page Top](#contents)

## Debugging

### Bug 1: posting twice

`Uncaught Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.`

The bug happens when posting a 2nd question. It still gets added to the DB, but the frontend stops running.

[react docs possible help](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level)

TODO: Possible cause is the typewriter custom hook. You shouldn't use state inside normal js functions. Maybe this isn't how to make a custom hook?

FIXED? the useType hook is called conditionally. I made it so that it is always called and the condition chooses whether to pass true or false as an argument. If false, the useType won't do the typing action.

### Bug 2: deleting twice

The newPostId value must change when deleting a post so that it triggers a useEffect that gets all the posts. I was passing the same string value each time so when deleting a 2nd post, the value didn't change so there was no re-render.

FIX: I fixed by passing the postId +1 for the newPostId. This is to make sure it will always be a new value.

[Page Top](#contents)
