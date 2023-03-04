import { Typography } from "@mui/material";

const Comment = ({ comment }) => {
  return (
    <>
      <Typography variant="body2" mb="0.25rem" borderTop="solid 1px #373737">
        - {comment}
      </Typography>
    </>
  );
};

export default Comment;
