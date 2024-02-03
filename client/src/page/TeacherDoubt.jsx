import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
// import ChatApp from "./Chat";
// import { useNavigate } from "react-router-dom";

const socket = io.connect(`${process.env.REACT_APP_SOCKET_BASE_URL}`);

function TeacherDoubt() {
  const teacherId = JSON.parse(localStorage.getItem("user")).id;
  const authToken = localStorage.getItem("token");
  const [questions, setQuestions] = useState([]);
  const [fare, setFare] = useState('');

  const navigate = useNavigate();

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    console.log(lat1, " : ", lon1);
    console.log(lat2, " : ", lon2);
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

  socket.on("questionAvailable", async (payload) => {
    const studentId = payload.studentId;
    const selectedCategory = payload.selectedCategory;
    const options = payload.options;
    const quantities = payload.quantities;
    const price = payload.price;
    const question = payload.question;
    const pic=payload.pic;
    // console.log("pic url",pic);
    const user_lat = payload.lat;
    const user_lon = payload.lon;
    let lat = '';
    let lon = '';
    let dist = '';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("lat ", latitude, "lon ", longitude);
          lat = latitude;
          lon = longitude;
          // setLat(latitude);
          // setLon(longitude);
          dist = getDistanceFromLatLonInKm(user_lat, user_lon, lat, lon);
          console.log("distance : ", dist);
          console.log("handymen : ", (JSON.parse(localStorage.getItem("user")).skills));
          console.log("asked ", selectedCategory);
          console.log(typeof(quantities));
          console.log(typeof(options));
          if (((JSON.parse(localStorage.getItem("user")).skills)).includes(selectedCategory)) {
            setQuestions([...questions, { studentId, question, dist, price, options, quantities,pic }]);
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

    console.log("new question ", question, studentId);
    if (dist == '') {
      if ((JSON.parse(localStorage.getItem("user")).skills).includes(selectedCategory)) {
        setQuestions([...questions, { studentId, question, dist,price, options, quantities,pic}]);
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

  socket.on("movetoHome",() => {
    console.log("move to home");
    let u=JSON.parse(localStorage.getItem("user"));
    u.messages=[];
    u.data=[];
    localStorage.setItem("user",JSON.stringify(u));
    navigate("/");
  });

  const handleAnswer = (e, studentId,price,question,selectedCategory) => {
    e.preventDefault();
    socket.emit("moveToChatTeacher", { studentId, teacherId,price,question,selectedCategory });
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

  const handleViewImage = (imageUrl) => {
    console.log("Open the image URL in a new tab"); 
    window.open(imageUrl, '_blank');
  };

  socket.on('moveToChat', (payload) => {
    console.log("moving to chat");
    let m = JSON.parse(localStorage.getItem("user"));
    m.data.push(payload.studentId);
    m.data.push(payload.teacherId);
    m.data.push(payload.price);
    m.data.push(payload.question);
    m.data.push(payload.selectedCategory);
    localStorage.setItem("user", JSON.stringify(m));
    navigate("/chat");
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
                    <textarea
                      className="p-4 rounded-xl"
                      type="text"
                      name="chat"
                      placeholder="filteredOptions"
                      value={questionObj.options}
                      readOnly={true}
                    />
                    <textarea
                      className="p-4 rounded-xl"
                      type="text"
                      name="chat"
                      placeholder="quantity : "
                      value={questionObj.quantities}
                      readOnly={true}
                    />
                    <div className="p-2 border border-black  bg-[#969090] ">Price : {questionObj.price}</div>
                    <div className="w-full bg-[#969090] p-2">Distance : {questionObj.dist}</div>
                    {/* <div className="p-3 bg-white pointer" onClick={handleViewImage(questionObj.pic)}>
                        View Image
                    </div> */}
                    <img src={questionObj.pic} height={300} width={400}></img>
                    <div className="flex mt-2">
                      <button
                        className="bg-green-500 text-white p-2 m-2 w-24 rounded-full "
                        onClick={(e) => handleAnswer(e, questionObj.studentId,questionObj.price,questionObj.question,questionObj.selectedCategory)}
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
