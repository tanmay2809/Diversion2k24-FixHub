import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
// import ChatApp from "./Chat";
// import { useNavigate } from "react-router-dom";

const socket = io.connect(`${process.env.REACT_APP_SOCKET_BASE_URL}`);

function HandymenRequest() {
  const handymenId = JSON.parse(localStorage.getItem("user")).id;
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
    socket.emit("teacherOnline", { handymenId });
    
    return () => {
      socket.emit("teacherOffline");
    };
  }, []);

  socket.on("questionAvailable", async (payload) => {
    const userId = payload.userId;
    const selectedCategory = payload.selectedCategory;
    const options = payload.options;
    const quantities = payload.quantities;
    const price = payload.price;
    const service = payload.service;
    const pic = payload.pic;
    // const question = payload.question;
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
            setQuestions([...questions, { userId, service, dist, price, options, quantities,pic }]);
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

    console.log("new service ", service, userId);
    if (dist == '') {
      if ((JSON.parse(localStorage.getItem("user")).skills).includes(selectedCategory)) {
        setQuestions([...questions, { userId, service, dist,price, options, quantities,pic}]);
      }
      else {
        socket.emit("teacherOffline");
      }
    }
  });

  socket.on("removeQuestion", async (payload) => {
    const userId = payload.userId;
    console.log(` ${userId} service answered by someone else`);
    setQuestions([
      ...questions.filter((questionObj) => {
        if (questionObj.userId === userId) {
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

  const handleAnswer = (e, userId,price,service,selectedCategory) => {
    e.preventDefault();
    socket.emit("moveToChatTeacher", { userId, handymenId,price,service,selectedCategory });
    setQuestions([]);
  };

  const handleDecline = (e, userId) => {
    e.preventDefault();
    setQuestions(
      questions.filter((question) => {
        if (question.userId === userId) {
          return false;
        }
        return true;
      })
    );
  };

  const handleRaise = (e, userId, fare) => {
    e.preventDefault();
    console.log("local storage data ", JSON.parse(localStorage.getItem("user")));
    console.log("handle rates function", userId, "  ", handymenId, "  ", fare);
    socket.emit("raiseRates", { userId, handymenId, fare });
  };

  const handleViewImage = (imageUrl) => {
    console.log("Open the image URL in a new tab"); 
    window.open(imageUrl, '_blank');
  };

  socket.on('moveToChat', (payload) => {
    console.log("moving to chat");
    let m = JSON.parse(localStorage.getItem("user"));
    m.data.push(payload.userId);
    m.data.push(payload.handymenId);
    m.data.push(payload.price);
    m.data.push(payload.service);
    m.data.push(payload.selectedCategory);
    localStorage.setItem("user", JSON.stringify(m));
    navigate("/chat");
  });

  return (
    <>
       <div className="App  p-6">
        <div className="flex flex-col items-center  p-6 leading-10 text-5xl font-bold">
          LIVE SERVICES
          <div className="w-28 h-1 mt-4  bg-[#EAB308]"></div>
        </div>
        <div className="flex justify-center">
          {/* <h3 className="text-4xl text-black font-semibold m-4">Incoming Doubts</h3> */}
          <div className=" bg-deepBlue App-header w-[400px] p-5 bg-slate-300 text-[#ffffff] ">
            {questions.map((questionObj) => {
              return (
                <div className="flex justify-center">
                  <div
                    className="question px-[12px] py-5 flex-col border-[#ffffff] bg-slate-900 rounded-xl m-1 text-[#000000] "
                    key={questionObj.userId}
                    userId={questionObj.userId}
                  >
                    <div className="text-[#ffffff] p-2 pl-0">Problem:</div>
                    <textarea
                      className="w-full p-2 bg-[#b5d0f6] rounded-md"
                      type="text"
                      name="chat"
                      placeholder="type service"
                      value={questionObj.service}
                      readOnly={true}
                    />
                    {/* <textarea
                      className="w-full p-2 bg-[#b5d0f6] rounded-md"
                      type="text"
                      name="chat"
                      placeholder="filteredOptions"
                      value={questionObj.options}
                      readOnly={true}
                    />
                    <textarea
                      className="w-full p-2 bg-[#b5d0f6] rounded-md"
                      type="text"
                      name="chat"
                      placeholder="quantity : "
                      value={questionObj.quantities}
                      readOnly={true}
                    /> */}
                    <div className="text-[#ffffff] p-2 pl-0">Distance</div>
                    <div className=" bg-[#b5d0f6] mt-3  p-2 rounded-md mb-3">{questionObj.dist}</div>
                    <div className="text-[#ffffff] p-2 pl-0">Price:</div>
                    <div className=" bg-[#b5d0f6] mt-3  p-2 rounded-md mb-3"> {questionObj.price}</div>
                   
                    {/* <div className="p-3 bg-white pointer" onClick={handleViewImage(questionObj.pic)}>
                        View Image
                    </div> */}
                    <img src={questionObj.pic} height={200} width={400}></img>
                    <div className="flex justify-around mt-2">
                      <button
                        className="bg-[#28aa7a] text-[#ffffff] p-2 mb-2 w-32 rounded-full "
                        onClick={(e) => handleAnswer(e, questionObj.userId,questionObj.price,questionObj.service,questionObj.selectedCategory)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-[#ad2626] text-[#ffffff] p-2 mb-2 ml-0 w-32 rounded-full"
                        onClick={(e) => handleDecline(e, questionObj.userId)}
                      >
                        Decline
                      </button>
                    </div>
                    <div>
                      <form className="flex mt-2 flex-row gap-1">
                        <input type="text"
                          name="fare"
                          id="fare"
                          className="placeholder-[#3e7f99] block w-[90%] rounded-lg border border-gray-300 bg-[#b5d0f6] p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          required
                          onChange={(e) => setFare(e.target.value)} placeholder="Enter the rate"></input>
                        <button onClick={(e) => handleRaise(e, questionObj.userId, fare)} className="bg-[#EAB308] text-[#000000] w-[40%] py-[14px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200">Send</button>
                        
                      </form>
                      <div className="w-[350px] h-1 mt-4  bg-gray2"></div>
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

export default HandymenRequest;
