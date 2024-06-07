import { Header } from "../../components";
import { useTheme } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Container = ({ selectedTheme, toggleTheme }) => {
  const theme = useTheme();

  useEffect(() => {
    document.documentElement.style.background =
      theme.palette.background.default;
    document.documentElement.style.color = theme.palette.text.primary;
    document.body.style.background = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [theme]);

  return (
    <div className="divide-y flex flex-col min-h-screen">
      <Header selectedTheme={selectedTheme} toggleTheme={toggleTheme}/>
      <div style={{ marginTop: '60px' }} className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Container;
