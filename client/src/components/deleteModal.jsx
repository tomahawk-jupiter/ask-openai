import { useState } from "react";
import { Box, Modal, Button, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axiosInstance from "../axios.config";

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
  textAlign: "center",
};

export default function DeleteModal({
  postId,
  setNewPostId,
  setDelPostId,
  setFlash,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeletePost = async () => {
    try {
      await axiosInstance.delete(`/${postId}`);

      // the newPostId is used to trigger a useEffect
      // +1 to make sure this value definetly changes
      setNewPostId(postId + 1);
    } catch (err) {}

    setDelPostId(postId);
    setFlash(true);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} color="error">
        <DeleteForeverIcon />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Warning!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to permanently delete this post?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleDeletePost} color="error">
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
