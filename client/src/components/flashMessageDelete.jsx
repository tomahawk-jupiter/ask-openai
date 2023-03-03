// import * as React from "react";
import { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FlashMessageDelete({ flash, setFlash, message, type }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFlash(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        sx={{
          height: "100vh",
          position: "fixed",
          display: "flex",
          alignItems: "flex-end",
        }}
        open={flash}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert severity={type}>{message}</Alert>
      </Snackbar>
    </Stack>
  );
}
