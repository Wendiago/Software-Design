import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themes } from "./theme/themes";
import React, { useState } from "react";
import { Container } from "./components";
import {
  Homepage,
  Categories,
  SearchResult,
  NovelIntroduction,
  NovelReading,
  AuthorRelated,
} from "./pages";
import "./App.css";

function App() {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const theme = createTheme(themes[selectedTheme]);
  const toggleTheme = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Container
                selectedTheme={selectedTheme}
                toggleTheme={toggleTheme}
              />
            }
          >
            <Route index element={<Navigate replace to="/trang-chu" />} />
            <Route path="/trang-chu" element={<Homepage />} />
            <Route path="/the-loai/:category" element={<Categories />} />
            <Route path="/tim-kiem/:keyword" element={<SearchResult />} />
            <Route path="/gioi-thieu/:title" element={<NovelIntroduction />} />
            <Route path="/tac-gia/:author" element={<AuthorRelated />} />
            <Route
              path="/doc-truyen/:title/:chapter"
              element={<NovelReading />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
