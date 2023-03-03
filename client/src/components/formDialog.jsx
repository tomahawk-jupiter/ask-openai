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

export default function FormDialog({ setNewPostId, setLoading }) {
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
    setInput(e.target.value.trim());
  };

  const postNewQuestion = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/", { question: input });
      console.log({ postQuestRes: res.data });
      const newPostId = res.data._id;

      setNewPostId(newPostId);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      setFlash(true);
    }
  };

  const handleSubmitButton = () => {
    if (input.length > 0) {
      postNewQuestion();
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
            disabled={input.length < 1}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <FlashMessageDelete
        flash={flash}
        setFlash={setFlash}
        message="Question failed!"
        type="error"
      />
    </div>
  );
}
