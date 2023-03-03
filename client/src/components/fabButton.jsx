import Fab from "@mui/material/Fab";
import CreateIcon from "@mui/icons-material/Create";
import { styled } from "@mui/material/styles";

// Would it be better to just use sx prop to style the Fab?
const FloatFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: "50px",
  right: "calc(50% - 25px)",
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
}));

const FabButton = ({ handleClickOpen }) => {
  return (
    <FloatFab onClick={handleClickOpen}>
      <CreateIcon />
    </FloatFab>
  );
};

export default FabButton;
