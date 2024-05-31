import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { themes } from "./theme/themes";
import React, { useState } from 'react';
import { Container } from "./components";
import { 
  Homepage,
  Categories,
  SearchResult,
  NovelIntroduction,
  NovelReading,
  AuthorRelated
} from './pages';
import './App.css';

function App() {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const theme = createTheme(themes[selectedTheme]);
  const toggleTheme = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme);
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
              path="/trang-chu"
              element={
                <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                  <Homepage />
                </Container>
              }
            />
            <Route
              path="/the-loai/:category"
              element={
                <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                  <Categories />
                </Container>
              }
            />
            <Route
              path="/tim-kiem/:keyword"
              element={
                <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                  <SearchResult />
                </Container>
              }
            />
            <Route
              path="/gioi-thieu/:title"
              element={
                <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                  <NovelIntroduction />
                </Container>
              }
            />
            <Route
              path="/tac-gia/:author"
              element={
                <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                  <AuthorRelated />
                </Container>
              }
            />
            <Route
              path="/doc-truyen/:title/:chapter"
              element={
                <Container selectedTheme={selectedTheme} toggleTheme={toggleTheme} >
                  <NovelReading />
                </Container>
              }
            />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
