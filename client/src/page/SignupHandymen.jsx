import React, { useState, useContext } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
const options = [
  { label: "Carpenter", value: "Carpenter" },
  { label: "Electrician", value: "Electrician" },
  { label: "Plumber", value: "Plumber" },
];

const def = {
  name: "",
  email: "",
  password: "",
  skill: [],
};

const SignupHandymen = () => {
  const [selected, setSelected] = useState([]);

  const ashu = selected.map((e) => {
    return e.value;
  });

  //console.log(selected);
  const [signstate, setSignState] = useState(def);
  const { setUserName, setIsLoggedIn, setUserType } = useContext(LoginContext);
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
    urlencoded.append("skills", ashu);
    // urlencoded.append("education", signstate.education);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/handymen/register`, requestOptions)
      .then((response) => {
        // if (response.status !== 200) {
        //   throw new Error("something went wrong");
        // }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        setIsLoggedIn(true);
        setUserName(result.name);
        setUserType(result.type);
        localStorage.setItem("token", result.token);
        console.log("selected , ",selected, " ashu ",ashu);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: result._id,
            name: result.name,
            isAuthed: true,
            type: result.type,
            skills: ashu,
            messages:[],
            data:[],
          })
        );
        navigate("/profileHandymen");
      })
      .catch((error) => console.log("error", error));

    setSignState(def);
  };

  return (
    <>
      <div class="flex justify-center">
        <div class="w-[500px] m-10 p-5 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <p class="flex justify-center font-bold text-4xl">Handymen SignUp</p>
          <p class="m-5 font-semibold">Enter Your Name</p>
          <input
            type="name"
            name="name"
            id="floating_name"
            class=" w-full p-3 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            placeholder="First name"
            onChange={(e) => onInputChange(e)}
          />
          
          <p class="m-5 font-semibold">Enter Email</p>
          <input
            type="email"
            name="email"
            id="floating_email"
            className="w-full p-3 ring-2 ring-lightGray rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            placeholder="email Id"
            onChange={(e) => onInputChange(e)}
          />

           <div className="mt-4">
            <label for="comment" className=" font-semibold ml-6 mb-3 ">
              Domain
            </label>
            <pre className=" hidden">{JSON.stringify(selected)}</pre>
            <MultiSelect
              className="mt-3"
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy="Select Tags"
              hasSelectAll={false}
            />
          </div>

           <div className="group relative z-0 mb-6 w-full">
            <p class="m-5 font-semibold">Password</p>
            <input
              type="password"
              name="password"
              id="floating_password"
              class="w-full p-3 ring-2 ring-lightGray rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              placeholder=" "
              required
              onChange={(e) => onInputChange(e)}
              // onChange={(e) => onInputChange(e)}
            />
          </div>
          <div class="flex justify-center">
            <button
              onClick={(e) => {
                handleSubmit(e);
              }}
              type="button"
              class="bg-[#EAB308] w-full text-[#000000]  py-[14px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200"
            >
              SignUp 
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupHandymen;

