import { Box, Card, Typography, Avatar, Button } from "@mui/material";
import { deepOrange, teal } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import useType from "../helperFunctions/useType";
import CommentsPanel from "./commentsPanel";
import DeleteModal from "./deleteModal";

const Row = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: "0.5rem",
}));

const MyCard = styled(Card)(({ theme }) => ({
  marginBottom: "0.5rem",
  padding: "0.5rem",
}));

const Post = ({
  id,
  question,
  answer,
  comments,
  newPostId,
  setNewPostId,
  setDelPostId,
  setFlash,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(comments.length);

  const commentCountLabel = `${commentCount} Comments`;

  const incCommentCount = () => {
    setCommentCount(commentCount + 1);
  };

  // Scroll newly added post into view
  useEffect(() => {
    if (newPostId == id) {
      const justAddedPost = document.getElementById(newPostId);
      justAddedPost.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [newPostId]);

  return (
    <MyCard id={id}>
      <MyCard>
        <Row>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>Q</Avatar>

          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {question}
          </Typography>
        </Row>
      </MyCard>
      <MyCard>
        <Row>
          <Avatar sx={{ bgcolor: teal[500] }}>Ai</Avatar>

          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {id == newPostId ? useType(answer, true) : useType(answer, false)}
          </Typography>
        </Row>
      </MyCard>

      <CommentsPanel
        isOpen={isOpen}
        comments={comments}
        incCommentCount={incCommentCount}
        postId={id}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => setIsOpen(!isOpen)} variant="text">
          {isOpen ? "Hide" : commentCountLabel}
        </Button>

        <DeleteModal
          postId={id}
          setNewPostId={setNewPostId}
          setDelPostId={setDelPostId}
          setFlash={setFlash}
        />
      </Box>
    </MyCard>
  );
};

export default Post;
