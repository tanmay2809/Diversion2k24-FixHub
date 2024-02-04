import "./App.css";
import "./index.css"
import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Header from "./component/Header";
import Footer from "./component/Footer";
import SignUp from "./page/SignUp";
import Login from "./page/Login";
import Profile from "./page/ProfileHandymen";
import ProfileUser from "./page/ProfileUser";
import Pricing from "./component/Pricing";
import { LoginContext } from "./contexts/LoginContext";
import ProtectedRoutes from "./component/ProtectedRoute";
import ProtectedUserRoute from "./component/ProtectedUserRoute";
import ProtectedHandymenRoute from "./component/ProtectedHandymenRoute";
import SignupHandymen from "./page/SignupHandymen";
import HandymenLogin from "./page/HandymenLogin";
import UserRequest from "./page/UserRequest";
import HandymenRequest from "./page/HandymenRequest";
import { useNavigate } from "react-router-dom";
import ChatApp from "./page/Chat";
import ProfileHandymen from "./page/ProfileHandymen";
function App() {
    const [userno, setUserno] = useState(0);
    // const[sid , setSid]=useState("");
    //    const [tid, settid] = useState("");
    const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("user"))?.isAuthed || false
  );
  const [userSkills, setUserSkills] = useState(
    JSON.parse(localStorage.getItem("user"))?.name || ""
  );
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user"))?.id || ""
  );
  const [userName, setUserName] = useState(
    JSON.parse(localStorage.getItem("user"))?.name || ""
  );
  const [userEmail, setUserEmail] = useState(
    JSON.parse(localStorage.getItem("user"))?.email || ""
  );
  const [userType, setUserType] = useState(
    JSON.parse(localStorage.getItem("user"))?.type || ""
  );
  const [userAddress, setUserAddress] = useState(
      JSON.parse(localStorage.getItem("user"))?.address || ""
    );
    const [userPincode, setUserPincode] = useState(
      JSON.parse(localStorage.getItem("user"))?.pincode || ""
    );
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
  };
   useEffect(() => {
     //const userInfo = JSON.parse(localStorage.getItem("userInfo"));
     if (userno == 1) {
       navigate("/chat");
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [navigate]);
  return (
      <LoginContext.Provider
        value={{
          userAddress, 
          setUserAddress,
          userPincode, 
          setUserPincode,
          userno,
          setUserno,
          isLoggedIn,
          setIsLoggedIn,
          userSkills,
          setUserSkills,
          // userEdu,
          // setUserEdu,
          userName,
          setUserName,
          userEmail,
          setUserEmail,
          userType,
          setUserType,
          userId,
          setUserId,
          logout,
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/handymen/login" element={<HandymenLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupHandymen" element={<SignupHandymen />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<ProtectedUserRoute />}>
              <Route path="/profileUser" element={<ProfileUser />} />
              {/* <Route path="/doubt" element={<Doubt />} /> */}
              <Route path="/requestService" element={<UserRequest />} />
            </Route>
            <Route element={<ProtectedHandymenRoute />}>
              <Route path="/profileHandymen" element={<ProfileHandymen />} />
            {/* <Route path="/doubtSection" element={<DoubtRender />} /> */}
              <Route path="/serviceSection" element={<HandymenRequest />} />
            </Route>
            <Route path="/pricing" element={<Pricing />} />
          </Route>
          <Route path="/chat" element={<ChatApp />}></Route>
        </Routes>
        {/* <Feedbackpage /> */}
        {/* <Footer /> */}
      </LoginContext.Provider>
  
  );
}

export default App;
