import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Main from "./views/main/Main";
import Login from "./views/autorisation/Login";
import Layout from "./views/layout/Layout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
