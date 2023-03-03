import { Box, Container, Switch } from "@mui/material";
import { useState } from "react";

import HelpModal from "./helpModal";

const stickyHeaderStyles = {
  position: "sticky",
  width: "100%",
  top: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "background.default",
};

const Header = ({ setThemeMode }) => {
  const [checked, setChecked] = useState(true);

  const handleThemeSwitch = () => {
    setChecked(!checked);
    setThemeMode(checked ? "light" : "dark");
  };

  return (
    <Container sx={stickyHeaderStyles}>
      <h1>Ask OpenAI</h1>
      <Box sx={{ display: "flex" }}>
        <HelpModal />
        <Switch checked={checked} onChange={handleThemeSwitch} />
      </Box>
    </Container>
  );
};

export default Header;
