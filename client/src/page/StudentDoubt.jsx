import { useState, useEffect, useContext,  useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LoginContext } from "../contexts/LoginContext";
const socket = io.connect(`${process.env.REACT_APP_SOCKET_BASE_URL}`);

function StudentDoubt() {
  const studentId = JSON.parse(localStorage.getItem("user")).id;
  const authToken = localStorage.getItem("token");
  const [question, setQuestion] = useState("");
  const resultRef = useRef();
  const navigate = useNavigate();
  const [rates, setRates] = useState([]);
   const { userno, setUserno ,sid ,setsid } = useContext(LoginContext);
  useEffect(() => {
  
  },[]);
  socket.emit("studentConnected", { studentId });

  socket.on("raiseFare", (payload) => {
    console.log(JSON.parse(localStorage.getItem("user")));
    console.log("payload :", payload);
    console.log("inside raise rates event");
    setRates((prevRates) => [...prevRates, payload]);
    console.log(rates);
  });

  const sendQuestion = (e) => {
    e.preventDefault();
    console.log("local storage : ",JSON.parse(localStorage.getItem("user")));
    console.log("questionAsked", question, studentId);
    const lat = JSON.parse(localStorage.getItem("user")).lat;
    const lon = JSON.parse(localStorage.getItem("user")).lon;
    socket.emit("questionAsked", { question, studentId,lat,lon });
    setQuestion("");
    resultRef.current.innerText = "Waiting for handymen to accept...";
  };

  function handleAccept(teacherId,studentId) {
    socket.emit('moveToChatStudent', { studentId,teacherId });
    setQuestion("");
  };

  function handleDecline(teacherId) {
    setRates((prevRates) =>
      prevRates.filter((rate) => rate.teacherId == teacherId)
    );
  }

  socket.on('moveToChat',(payload)=>{
    console.log("moving to chat");
    setUserno(1);
    setsid(payload.studentId); 
    navigate("/chat",{ state: { value1: payload.studentId, value2: payload.teacherId }});
  });

  return (
    <div className='pt-28'>
      <div className="flex justify-center text-4xl p-6 font-semibold">
        ASK FOR SERVICE
      </div>
      <div className="flex justify-center w-full p-6">
        <header
          className="App-header border-black bg-slate-200 rounded-2xl p-12 shadow-xl"
          ref={resultRef}
        >
          <form onSubmit={sendQuestion}>
            <input
              className="border-black rounded-lg p-4 m-4"
              type="text"
              name="chat"
              placeholder="domain"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            />
            <button
              type="submit"
              className=" rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              ASK
            </button>
          </form>
        </header>
      </div>
      <div>
        <ul>
          {rates.map((rate) => (
            <li key={rate._id}>
              Fare: {rate.payload.fare}
              {!rate.accepted && (
                <>
                  <button onClick={() => handleAccept(rate.payload.teacherId,rate.payload.studentId)}>Accept</button>
                  <button onClick={() => handleDecline(rate.payload.teacherId)}>Decline</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentDoubt;