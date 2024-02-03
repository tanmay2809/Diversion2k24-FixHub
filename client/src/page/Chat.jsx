// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import { useLocation } from 'react-router-dom';
// const ChatApp = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const location = useLocation();

//   const sid = location.state?.value1;
//   console.log("sid",sid)
//   const tid = location.state?.value2;
//   console.log("tid",tid);

//   const id_c = JSON.parse(localStorage.getItem("user")).id;
//   console.log("user : ",id_c);
//   const socket = io("http://localhost:4000");

//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on('chat message', (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//       window.scrollTo(0, document.body.scrollHeight);
//     });

//     // Clean up socket connection when component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if(inputValue) {
//       socket.emit('chat message', inputValue);
//       setInputValue('');
//     }
//   };

//   return (
//     <div>
//       <div className='m-0 pb-3 my-20'>
//         <ul id="messages" className='odd:bg-white even:bg-slate-50'>
//           {messages.map((msg, index) => (
//             <li key={index} className='odd:bg-white even:bg-[#929191]'>{msg}</li>
//           ))}
//         </ul>
//         <form id="form" className='bg-[#b8b6b6] p-[0.25rem] fixed bottom-0 left-0 right-0 flex f-[3rem]'>
//           <input
//             id="input"
//             autoComplete="off"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className='m-0.25rem py-[1rem] rounded-md w-[78%] placeholder:mx-3'
//           />
//           <button type="submit" onClick={handleFormSubmit} className='bg-[#333] py-[1rem] m-[0.25rem] rounded-md w-[10%] text-white'>Send</button>
//           <div>
//           {id_c == sid && 
//             <button className='bg-[#333] py-[1rem] m-[0.25rem] rounded-md px-6  text-white'>Finsih</button>
//           }
//           </div>
//           <div>
//           {id_c == tid && 
//             <button className='bg-[#333] py-[1rem] m-[0.25rem] rounded-md px-5 text-white'>Make Payment</button>
//           }
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default ChatApp;



import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

const ChatApp = () => {
  const navigate = useNavigate()
  console.log(JSON.parse(localStorage.getItem("user")));
  let m = JSON.parse(localStorage.getItem("user")).messages;
  let data = JSON.parse(localStorage.getItem("user")).data;
  const sid= data[0];
  const tid = data[1];

  const [messages, setMessages] = useState(m);
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const { userno, setUserno } = useContext(LoginContext);
  // const sidd = sid
  // console.log(sid)
  // console.log(location.state)
  // const tidd = tid
  // console.log(tid)
  const id_c = JSON.parse(localStorage.getItem("user")).id;
  console.log(id_c)
  const socket = io("http://localhost:4000");
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    setUserno(1);

    socket.on("chat message", (msg) => {
      let u = JSON.parse(localStorage.getItem("user"));
      console.log("user", u);
      console.log("messages : ", m);
      u.messages.push(msg);
      setMessages(u.messages);
      localStorage.setItem("user", JSON.stringify(u));
      window.scrollTo(0, document.body.scrollHeight);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    try {
      const { data } = await axios.post(
        "http://localhost:5000/payment/razorpay",
        { amount: 500 }
      );
      const options = {
        key: "rzp_test_j3uMC3pJNVXJpR",
        amount: data.amount,
        currency: data.currency,
        name: "Service",
        description: "Test Transaction",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyUrl = "http://localhost:5000/payment/verification";
            const { data } = await axios.post(verifyUrl, {
              ...response,
              sid,
              tid,
            });
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.log(error);
    }
    setUserno(2);
    navigate("/");
  };

  function finishhandler(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("user"));
    console.log("finish handler : ",u.data);
    console.log("data0",u.data[0]);
    socket.emit("moveToHomeHandymen",u.data[0]);
    u.messages = [];
    setMessages(u.messages);
    u.data=[];
    localStorage.setItem("user", JSON.stringify(u));
    setUserno(2);
    
  }

  return (
    <div>
      <div className="m-0 pb-3 my-20">
        <ul id="messages" className="odd:bg-white even:bg-slate-50">
          {messages.map((msg, index) => (
            <li key={index} className="odd:bg-white even:bg-[#929191]">
              {msg}
            </li>
          ))}
        </ul>
        <form
          id="form"
          className="bg-[#b8b6b6] p-[0.25rem] fixed bottom-0 left-0 right-0 flex f-[3rem]"
        >
          <input
            id="input"
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="m-0.25rem py-[1rem] rounded-md w-[78%] placeholder:mx-3"
          />
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="bg-[#333] py-[1rem] m-[0.25rem] rounded-md w-[10%] text-white"
          >
            Send
          </button>
          <div>
            {id_c == tid && (
              <button onClick={finishhandler} className="bg-[#333] py-[1rem] m-[0.25rem] rounded-md px-6  text-white">
                Finish
              </button>
            )}
          </div>
          <div>
            {id_c === sid && (
              <button
                onClick={handlePayment}
                className="bg-[#333] py-[1rem] m-[0.25rem] rounded-md px-5 text-white"
              >
                Make Payment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;

