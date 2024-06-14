import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { themes } from "./theme/themes";
import { useState } from "react";
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
import { PrioritizedSourcesProvider } from "./contexts/PrioritizedSourcesContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 8 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <ThemeProvider theme={theme}>
        <PrioritizedSourcesProvider>
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
                <Route
                  path="/gioi-thieu/:title"
                  element={<NovelIntroduction />}
                />
                <Route path="/tac-gia/:author" element={<AuthorRelated />} />
                <Route
                  path="/doc-truyen/:title/:chapter"
                  element={<NovelReading />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </PrioritizedSourcesProvider>
      </ThemeProvider>

      <Toaster
        gutter={12}
        containerStyle={{ margin: "8px" }}
        position="top-center"
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#fff",
            color: "#384252",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
