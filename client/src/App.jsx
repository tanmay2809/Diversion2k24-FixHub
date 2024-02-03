import "./App.css";
import "./index.css"
import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Header from "./component/Header";
import Footer from "./component/Footer";
import SignUp from "./page/SignUp";
import Login from "./page/Login";
import Profile from "./page/Profiletut";
import Profilestudent from "./page/Profilestudent";
import Pricing from "./component/Pricing";
import { LoginContext } from "./contexts/LoginContext";
import ProtectedRoutes from "./component/ProtectedRoute";
import ProtectedStudRoutes from "./component/ProtectedStudRoute";
import ProtectedTeachRoutes from "./component/ProtectedTeachRoute";
import Signuptut from "./page/Signuptut";
import Feedbackpage from "./component/Feedbackpage";
import TutorLogin from "./page/TutorLogin";
import StudentDoubt from "./page/StudentDoubt";
import TeacherDoubt from "./page/TeacherDoubt";
import VideoComponent from "./component/VideoComponent";
import { useNavigate } from "react-router-dom";
import ChatApp from "./page/Chat";
function App() {
    const [userno, setUserno] = useState(0);
    const[sid , setsid]=useState("");
       const [tid, setid] = useState("");
    const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("user"))?.isAuthed || false
  );
  const [userSkills, setUserSkills] = useState(
    JSON.parse(localStorage.getItem("user"))?.name || ""
  );
  const [userEdu, setUserEdu] = useState(
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
          sid,           
          setsid,
          tid , 
          setid,
          userno,
          setUserno,
          isLoggedIn,
          setIsLoggedIn,
          userSkills,
          setUserSkills,
          userEdu,
          setUserEdu,
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
          <Route path="/tutor/login" element={<TutorLogin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signuptut" element={<Signuptut />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<ProtectedStudRoutes />}>
              <Route path="/profilestudent" element={<Profilestudent />} />
              {/* <Route path="/doubt" element={<Doubt />} /> */}
              <Route path="/doubt" element={<StudentDoubt />} />
              <Route path="/feedback" element={<Feedbackpage />} />
            </Route>
            <Route element={<ProtectedTeachRoutes />}>
              <Route path="/profileteacher" element={<Profile />} />
            {/* <Route path="/doubtSection" element={<DoubtRender />} /> */}
              <Route path="/doubtSection" element={<TeacherDoubt />} />
            </Route>
            <Route path="/pricing" element={<Pricing />} />
          </Route>
          <Route path="/chat" element={<ChatApp />}></Route>
          <Route path="/video" element={<VideoComponent />} />
        </Routes>
        {/* <Feedbackpage /> */}
        {/* <Footer /> */}
      </LoginContext.Provider>
  
  );
}

export default App;
