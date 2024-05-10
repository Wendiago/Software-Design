import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { themes } from "./theme/themes";
import React, { useState, useEffect } from 'react';
import { Container } from "./components";
import { 
  Homepage
} from './pages';
import './App.css';

function App() {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const theme = createTheme(themes[selectedTheme]);
  const toggleTheme = (theme) => {
    console.log(theme)
    setSelectedTheme(theme);
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                <Homepage />
              </Container>
            }
          />
          <Route
            path="/index"
            element={
              <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                <Homepage />
              </Container>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
