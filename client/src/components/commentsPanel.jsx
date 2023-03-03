import { Container, TextField } from "@mui/material";
import { useRef, useState } from "react";
import axiosInstance from "../axios.config";
import Comment from "./comment";

const CommentsPanel = ({ isOpen, comments, incCommentCount, postId }) => {
  const [input, setInput] = useState("");
  const [commentsInState, setCommentsInState] = useState(comments);
  const commentInput = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const postNewComment = async () => {
    try {
      const newCommentRes = await axiosInstance.post(`/${postId}`, {
        commentText: input,
      });
      setCommentsInState([...commentsInState, newCommentRes.data]);
      incCommentCount();
      console.log({ newCommentRes: newCommentRes.data });
    } catch (err) {
      console.log({ postNewCommentErr: err });
      const notSavedComment = {
        _id: Date.now(),
        text: input,
      };
      setCommentsInState([...commentsInState, notSavedComment]);
      incCommentCount();
    }
  };

  const handleSubmit = (e) => {
    if (e.code === "Enter" && input.trim().length > 0) {
      postNewComment(); // Adds to DB
      setInput("");
      commentInput.current.children[1].children[0].blur(); // unFocus after submit
    }
  };

  return (
    <Container sx={{ ml: "4rem", display: `${isOpen ? "block" : "none"}` }}>
      {commentsInState.map((comment) => {
        return <Comment key={comment._id} comment={comment.text} />;
      })}
      <div>
        <TextField
          label="Comment..."
          variant="outlined"
          size="small"
          onKeyDown={handleSubmit}
          value={input}
          onChange={handleChange}
          ref={commentInput}
          sx={{ marginTop: "0.5rem" }}
          autoFocus={isOpen}
          inputProps={{ maxLength: 240 }}
          multiline
        />
      </div>
    </Container>
  );
};

export default CommentsPanel;
