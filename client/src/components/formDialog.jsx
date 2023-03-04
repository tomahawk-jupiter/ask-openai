import { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import FabButton from "./fabButton";
import axiosInstance from "../axios.config";
import FlashMessageDelete from "./flashMessageDelete";

export default function FormDialog({
  mockMode,
  posts,
  setPosts,
  setNewPostId,
  setLoading,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setInput("");
    setOpen(false);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const postNewQuestion = async () => {
    try {
      setLoading(true);
      // Returns an answer
      const res = await axiosInstance.post("/", { question: input });

      // TEST: dummy response for testing.
      // const res = await axiosInstance.post("/test/post", { question: input });

      const newPost = res.data;

      setNewPostId(newPost._id);
      setPosts([...posts, res.data]);
    } catch (err) {
      // add the post to state even if DB api fails
      setLoading(false);
      setFlash(true);
    }
  };

  const mockPostNewQuestion = () => {
    const newPostMock = {
      _id: Date.now(),
      question: input,
      answer:
        "Sorry, the backend is unavailable. This is placeholder text. \nLorem ipsum dolor sit, amet consectetur adipisicing elit. In maxime enim id ipsam, fuga maiores illo quibusdam dolores omnis sed! Illum, neque ullam! Ut officia nostrum, accusamus perferendis ad laborum?",
      comments: [],
    };
    setPosts([...posts, newPostMock]);
    setNewPostId(newPostMock._id);
  };

  const handleSubmitButton = () => {
    if (input.trim().length > 0) {
      mockMode ? mockPostNewQuestion() : postNewQuestion();
      setInput("");
      handleClose();
    }
  };

  return (
    <div>
      <FabButton handleClickOpen={handleClickOpen} />

      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Ask ai..."
            fullWidth
            variant="standard"
            value={input}
            onChange={handleChange}
            autoFocus
            inputProps={{ minLength: 2, maxLength: 240 }}
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmitButton}
            disabled={input.trim().length < 1}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <FlashMessageDelete
        flash={flash}
        setFlash={setFlash}
        message="Question failed! Try again in 1 minute."
        type="error"
      />
    </div>
  );
}
