import { CircularProgress } from "@mui/material";

const LoadingIcon = () => {
  return (
    <CircularProgress
      sx={{ position: "fixed", top: "40%", left: "calc(50% - 28px)" }}
    />
  );
};

export default LoadingIcon;
