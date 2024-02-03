import { useState, useEffect  , useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatApp from "./Chat";
import { LoginContext } from "../contexts/LoginContext";

// import { useNavigate } from "react-router-dom";

const socket = io.connect(`${process.env.REACT_APP_SOCKET_BASE_URL}`);

function TeacherDoubt() {
    const { userno, setUserno ,tid,setid} = useContext(LoginContext);
  const teacherId = JSON.parse(localStorage.getItem("user")).id;
  const authToken = localStorage.getItem("token");
  const [questions, setQuestions] = useState([]);
  const [fare, setFare] = useState('');
  // const [lat,setLat] = useState('');
  // const[lon,setLon] = useState('');
  // const [dist,setDist] = useState('');

  const navigate = useNavigate();

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    console.log(lat1, " : ", lon1);
    console.log(lat2, " : ", lon2);
    // var R = 6371; // Radius of the earth in km
    // function deg2rad(deg) {
    //   return deg * (Math.PI / 180);
    // }
    // var dLat = deg2rad(lat2 - lat1); // deg2rad below
    // var dLon = deg2rad(lon2 - lon1);
    // var a =
    //   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //   Math.cos(deg2rad(lat1)) *
    //   Math.cos(deg2rad(lat2)) *
    //   Math.sin(dLon / 2) *
    //   Math.sin(dLon / 2);
    // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // var d = R * c; // Distance in km
    // var ans = Math.round(d * 100) / 100;
    const R = 6371; // Earth radius in kilometers

    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKm = R * c;

    // setDistance(distanceInKm.toFixed(2));

    return distanceInKm.toFixed(2);
  }

  useEffect(() => {
    socket.emit("teacherOnline", { teacherId });

    return () => {
      socket.emit("teacherOffline");
    };
  }, []);

  socket.on("questionAvailable", async(payload) => {
    const studentId = payload.studentId;
    const question = payload.question;
    const user_lat = payload.lat;
    const user_lon = payload.lon;
    let lat = '';
    let lon = '';
    let dist='';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("lat ", latitude, "lon ", longitude);
          lat = latitude;
          lon = longitude;
          // setLat(latitude);
          // setLon(longitude);
          dist = getDistanceFromLatLonInKm( user_lat , user_lon, lat, lon);
          console.log("distance : ",dist);
          if ((JSON.parse(localStorage.getItem("user")).skills).includes(question)) {
            setQuestions([...questions, { studentId, question, dist }]);
          }
          else {
            socket.emit("teacherOffline");
          }
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    } 
    else {
      console.error('Geolocation is not supported by your browser');
    }
    console.log("lat: ", lat, "lon : ", lon);
    console.log("userlat: ", user_lat, "userlon : ", user_lon);
    // await setDist(getDistanceFromLatLonInKm(user_lat, user_lon, lat, lon));

    console.log("new question ", question, studentId);
    if(dist==''){
    if ((JSON.parse(localStorage.getItem("user")).skills).includes(question)) {
      setQuestions([...questions, { studentId, question, dist }]);
    }
    else {
      socket.emit("teacherOffline");
    }
  }
  });

  socket.on("removeQuestion", async (payload) => {
    const studentId = payload.studentId;
    console.log(` ${studentId} question answered by someone else`);
    setQuestions([
      ...questions.filter((questionObj) => {
        if (questionObj.studentId === studentId) {
          return false;
        }
        return true;
      }),
    ]);
  });

  const handleAnswer = (e, studentId) => {
    e.preventDefault();
    socket.emit("moveToChatTeacher", { studentId, teacherId });
    setQuestions([]);
  };

  const handleDecline = (e, studentId) => {
    e.preventDefault();
    setQuestions(
      questions.filter((question) => {
        if (question.studentId === studentId) {
          return false;
        }
        return true;
      })
    );
  };

  const handleRaise = (e, studentId, fare) => {
    e.preventDefault();
    console.log("local storage data ", JSON.parse(localStorage.getItem("user")));
    console.log("handle rates function", studentId, "  ", teacherId, "  ", fare);
    socket.emit("raiseRates", { studentId, teacherId, fare });
  };

  socket.on('moveToChat', (payload) => {
    console.log("moving to chat");
    setUserno(1)
    console.log({
      state: { value1: payload.studentId, value2: payload.teacherId },
    });
    setid(payload.teacherId);
    navigate("/chat", { state: { value1: payload.studentId, value2: payload.teacherId } });
  });

  return (
    <>
      <div className="App h-full w-full p-6">
        <div className="flex justify-center text-4xl p-6 font-semibold">
          LIVE SERVICES
        </div>
        <div className="flex justify-center">
          {/* <h3 className="text-4xl text-black font-semibold m-4">Incoming Doubts</h3> */}
          <div className="App-header w-1/2 bg-slate-300 p-12">
            {questions.map((questionObj) => {
              return (
                <div className="flex justify-center">
                  <div
                    className="question p-10 flex-col border bg-slate-900 rounded-xl m-1"
                    key={questionObj.studentId}
                    studentId={questionObj.studentId}
                  >
                    <div className="text-white p-2 pl-0">Question:</div>
                    <textarea
                      className="p-4 rounded-xl"
                      type="text"
                      name="chat"
                      placeholder="type question"
                      value={questionObj.question}
                      readOnly={true}
                    />
                    <div className="w-full bg-[#969090] p-2">Distance : {questionObj.dist}</div>
                    <div className="flex mt-2">
                      <button
                        className="bg-green-500 text-white p-2 m-2 w-24 rounded-full "
                        onClick={(e) => handleAnswer(e, questionObj.studentId)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 m-2 ml-0 w-24 rounded-full"
                        onClick={(e) => handleDecline(e, questionObj.studentId)}
                      >
                        Decline
                      </button>
                    </div>
                    <div>
                      <form className="flex flex-row gap-1">
                        <input type="text"
                          name="fare"
                          id="fare"
                          className="block w-[70%] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          required
                          onChange={(e) => setFare(e.target.value)} placeholder="Enter the rate"></input>
                        <button onClick={(e) => handleRaise(e, questionObj.studentId, fare)} className="bg-[#ffffff] px-3 py-1 rounded-md">Send</button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherDoubt;
