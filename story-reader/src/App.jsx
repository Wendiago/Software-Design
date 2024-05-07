import { BrowserRouter, Route, Routes } from "react-router-dom";
import { 
  Homepage
} from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Homepage />
          }
        />
        <Route
          path="/index"
          element={
            <Homepage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
