// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { LoginContext } from "../contexts/LoginContext";

// const def = {
//   name: "",
//   email: "",
//   password: "",
//   confirmpasword: "",
//   address: "",
//   pincode: "",
// };
// const Signup = () => {
//   const [signstate, setSignState] = useState(def);
//   const { setUserName, setIsLoggedIn, setUserType, setUserId } =
//     useContext(LoginContext);
//   const navigate = useNavigate();

//   const onInputChange = (e) => {
//     setSignState({ ...signstate, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     var urlencoded = new URLSearchParams();
//     urlencoded.append("name", signstate.name);
//     urlencoded.append("email", signstate.email);
//     urlencoded.append("password", signstate.password);
//     urlencoded.append("address",signstate.address);
//     urlencoded.append("pincode",signstate.pincode);

//     var requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: urlencoded,
//       redirect: "follow",
//     };

//     fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/register`, requestOptions)
//       .then((response) => {
//         return response.json();
//       })
//       .then((result) => {
//         console.log(result);
//         setIsLoggedIn(true);
//         setUserName(result.name);
//         setUserType(result.type);
//         setUserId(result._id);
//         localStorage.setItem("token", result.token);
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             id: result._id,
//             name: result.name,
//             isAuthed: true,
//             type: result.type,
//             address: result.address,
//             pincode: result.pincode,
//             lat: result.lat,
//             lon: result.lon,
//           })
//         );
//         navigate("/profilestudent");
//       })
//       .catch((error) => console.log("error", error));

//     setSignState(def);
//   };

//   return (
//     <>
//       <div className="m-0 flex min-h-[100vh] max-w-full items-center justify-center rounded-md bg-slate-200 pt-28">
//         <div className="lg:h-[400px] lg:w-[400px] md:h-[350px] md:w-[350px]">
//           <h2 className="mb-4 text-2xl font-semibold">SIGNUP</h2>

//           <form>
//             <div className="group relative z-0 mb-6 w-full">
//               <input
//                 type="name"
//                 name="name"
//                 id="floating_name"
//                 className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
//                 placeholder=" "
//                 required
//                 onChange={(e) => onInputChange(e)}
//               />
//               <label
//                 htmlFor="floating_name"
//                 className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
//               >
//                 Your Name
//               </label>
//             </div>
//             <div className="group relative z-0 mb-6 w-full">
//               <input
//                 type="email"
//                 name="email"
//                 id="floating_email"
//                 className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
//                 placeholder=" "
//                 required
//                 onChange={(e) => onInputChange(e)}
//               />
//               <label
//                 htmlFor="floating_email"
//                 className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
//               >
//                 Email address
//               </label>
//             </div>
//             <div className="group relative z-0 mb-6 w-full">
//               <input
//                 type="password"
//                 name="password"
//                 id="floating_password"
//                 className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
//                 placeholder=" "
//                 required
//                 onChange={(e) => onInputChange(e)}
//               />
//               <label
//                 htmlFor="floating_password"
//                 className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
//               >
//                 password
//               </label>
//             </div>
//             <div className="group relative z-0 mb-6 w-full">
//               <input
//                 type="text"
//                 name="address"
//                 id="floating_address"
//                 className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
//                 placeholder=" "
//                 required
//                 onChange={(e) => onInputChange(e)}
//               />
//               <label
//                 htmlFor="floating_address"
//                 className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
//               >
//                 Address
//               </label>
//             </div>
//             <div className="group relative z-0 mb-6 w-full">
//               <input
//                 type="text"
//                 name="pincode"
//                 id="floating_pincode"
//                 className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
//                 placeholder=" "
//                 required
//                 onChange={(e) => onInputChange(e)}
//               />
//               <label
//                 htmlFor="floating_pincode"
//                 className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
//               >
//                 Pin code
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
//               onClick={(e) => {
//                 handleSubmit(e);
//               }}
//             >
//               SignUp
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Signup;



import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

const def = {
  name: "",
  email: "",
  password: "",
  confirmpasword: "",
  address: "",
  pincode: "",
};
const Signup = () => {
  const [signstate, setSignState] = useState(def);
  const { setUserName, setIsLoggedIn, setUserType, setUserId } =
    useContext(LoginContext);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setSignState({ ...signstate, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("name", signstate.name);
    urlencoded.append("email", signstate.email);
    urlencoded.append("password", signstate.password);
    urlencoded.append("address",signstate.address);
    urlencoded.append("pincode",signstate.pincode);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/register`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log(result);
        setIsLoggedIn(true);
        setUserName(result.name);
        setUserType(result.type);
        setUserId(result._id);
        localStorage.setItem("token", result.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: result._id,
            name: result.name,
            isAuthed: true,
            type: result.type,
            address: result.address,
            pincode: result.pincode,
            lat: result.lat,
            lon: result.lon,
            messages : [],
            data:[],
          })
        );
        navigate("/profileUser");
      })
      .catch((error) => console.log("error", error));

    setSignState(def);
  };

  return (
    <>
     <div className="m-0 flex h-[650px] max-w-full items-center justify-center rounded-md bg-slate-200">
        <div className="md:h-[350px] ring-4 ring-lightGray  rounded-md shadow-2xl p-10 md:w-[350px] lg:h-[500px] lg:w-[400px]">
          <h2 className="mb-4 text-3xl font-semibold ">SIGNUP</h2>

          <form>
            <div className="group relative z-0 mb-6 w-full">
              <input
                type="name"
                name="name"
                id="floating_name"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
                onChange={(e) => onInputChange(e)}
              />
              <label
                htmlFor="floating_name"
                className="absolute top-3  origin-[0] -translate-y-6 scale-75 transform text-base text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
              >
                Your Name
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                type="email"
                name="email"
                id="floating_email"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
                onChange={(e) => onInputChange(e)}
              />
              <label
                htmlFor="floating_email"
                className="absolute top-3  origin-[0] -translate-y-6 scale-75 transform text-base text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
              >
                Email address
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                type="password"
                name="password"
                id="floating_password"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
                onChange={(e) => onInputChange(e)}
              />
              <label
                htmlFor="floating_password"
                className="absolute top-3  origin-[0] -translate-y-6 scale-75 transform text-base text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
              >
                Password
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                type="text"
                name="address"
                id="floating_address"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
                onChange={(e) => onInputChange(e)}
              />
              <label
                htmlFor="floating_address"
                className="absolute top-3  origin-[0] -translate-y-6 scale-75 transform text-base text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
              >
                Address
              </label>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                type="text"
                name="pincode"
                id="floating_pincode"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                placeholder=" "
                required
                onChange={(e) => onInputChange(e)}
              />
              <label
                htmlFor="floating_pincode"
                className="absolute top-3  origin-[0] -translate-y-6 scale-75 transform text-base text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
              >
                Pin code
              </label>
            </div>

             <button
              type="submit"
              className="bg-[#EAB308] w-full text-[#000000]  py-[14px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200 focus:outline-none focus:ring-4  "
              onClick={(e) => handleSubmit(e)}
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;