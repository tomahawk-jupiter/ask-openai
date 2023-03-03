import { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "100vh",
  overflow: "auto",
};

export default function HelpModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Help</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Help
          </Typography>
          <p>
            Ask a question and the AI will respond with an answer, hopefully the
            correct one! The answers are limited to aprox 2000 characters.
          </p>
          <p>
            Questions are saved so you can see what other people have been
            asking.
          </p>
          <p>
            Each question starts afresh, the AI won't remember previous
            questions.
          </p>
          <p>
            Theres a limit to how many questions can be asked per minute with
            the free version of openai I'm using, so if it doesn't work, wait a
            few moments and try again.
          </p>
          <p>
            The server might take a short while to wake up if it hasn't been
            used recently.
          </p>
          <Button onClick={() => handleClose()}>Ok</Button>
        </Box>
      </Modal>
    </div>
  );
}
