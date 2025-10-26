import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./views/main/Main";
import Login from "./views/autorisation/Login";
import Registration from "./views/autorisation/Registration";
import Layout from "./views/layout/Layout";
import ProfileNavigator from "./views/profile/ProfileNavigator";
import ConfirmationEmail from "./views/autorisation/ConfirmationEmail";
import RequireAuth from "./middleware/requireAuth";
import FunpayAccountManager from "./views/profile/FunpayAccountManager";
import SteamAccountAdd from "./views/SteamAccountAdd/SteamAccountAdd";
import GmailConfirmation from "./views/SteamAccountAdd/GmailConfirmation";
import AddPool from "./views/profile/AddPool";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            {/* <Route element={<RequireAuth />}> */}
            <Route path="/profile" element={<ProfileNavigator />} />
            {/* </Route> */}
            <Route path="/verify/:token" element={<ConfirmationEmail />} />
            <Route path="/accountfp/:id" element={<FunpayAccountManager />} />
            <Route path="/steamaccountadd" element={<SteamAccountAdd />} />
            <Route
              path="/steamaccountadd/gmail"
              element={<GmailConfirmation />}
            />
            <Route path="/addpool/:id" element={<AddPool />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
