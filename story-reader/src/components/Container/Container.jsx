import React, { useState } from "react";
import { Header } from "../../components";
import { useTheme, Button } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const Container = ({ selectedTheme, toggleTheme }) => {
  const [isOpen, setOpen] = useState(true);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    document.documentElement.style.background = theme.palette.background.default;
    document.documentElement.style.color = theme.palette.text.primary;
    document.body.style.background = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [theme]);

  return (
    <div className="divide-y flex flex-col min-h-screen">
      {isOpen ? (
        <>
          <Header selectedTheme={selectedTheme} toggleTheme={toggleTheme}/>
          <Button 
            style={{
              position: 'fixed', 
              top: '70px', 
              left: '10px', 
              backgroundColor: theme.palette.background.default
            }}
            onClick={handleClose}>
            <FaChevronUp/>
          </Button>
          <div style={{ marginTop: '63px' }} className="flex-1">
            <Outlet />
          </div>
        </>
      ) : (
        <>
          <Button 
            style={{
              position: 'fixed', 
              top: '0px', 
              left: '10px', 
              backgroundColor: theme.palette.background.default 
            }}
            onClick={handleOpen}>
            <FaChevronDown/>
          </Button>
          <div className="flex-1">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Container;
