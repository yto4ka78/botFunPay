import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./views/main/Main";
import Login from "./views/autorisation/Login";
import Registration from "./views/autorisation/Registration";
import Layout from "./views/layout/Layout";
import ProfileNavigator from "./views/profile/ProfileNavigator";
import ConfirmationEmail from "./views/autorisation/ConfirmationEmail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile" element={<ProfileNavigator />} />
            <Route path="/verify/:token" element={<ConfirmationEmail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
