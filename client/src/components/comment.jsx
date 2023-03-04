import { Typography } from "@mui/material";

const Comment = ({ comment }) => {
  return (
    <>
      <Typography variant="body2" mb="0.25rem">
        - {comment}
      </Typography>
    </>
  );
};

export default Comment;
