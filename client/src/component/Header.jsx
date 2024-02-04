import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import logo from "../assets/logo.jpg";

const Header = () => {
  const [hamOpen, sethamOpen] = useState(false);

  const toggle = () => {
    sethamOpen(!hamOpen);
  };
  const { isLoggedIn, setIsLoggedIn, setUserName, userType } =
    useContext(LoginContext);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };
  // const user = JSON.parse(localStorage.getItem('user'));
  // console.log(user);

  return (
    <>
      <div class="shadow-lg ">
        <nav class="bg-transparent border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gra ">
          <div class="container flex flex-wrap items-center justify-between mx-auto">
            <div onClick={() => navigate("/")} class="flex items-center">
              <img src={logo} class=" w-[145px] h-6 mr-3 sm:h-9" alt="Logo" />
              {/* <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-black">
                CodeHelp
              </span> */}
            </div>
            <div className="flex md:order-2">
              {isLoggedIn ? (
                <div>
                  <button
                    className="bg-[#EAB308] text-[#000000]  py-[14px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200"
                    onClick={() => handleLogOut()}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-[#EAB308] text-[#000000]  py-[10px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="bg-[#EAB308] text-[#000000]  ml-3 py-[10px] px-[28px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button
                data-collapse-toggle="navbar-cta"
                type="button"
                class=" md:hidden px-2 py-2 mx-2 rounded focus:outlet-none hover:bg-gray-200 group"
                aria-expanded="false"
                onClick={toggle}
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>

              <div
                class={`absolute top-16 cursor-pointer ${
                  hamOpen ? "right-0 " : "right-[-300px]"
                } z-10 mt-2 w-56 origin-top-right rounded-md bg-[#ffffff] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                <ul>
                  <li
                    class="hover:bg-gray-200 py-4 px-6 w-full"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    <div>Home</div>
                  </li>
                  {userType === "user" ? (
                    <li
                      class="hover:bg-gray-200 py-4 px-6 w-full"
                      onClick={() => {
                        navigate("/requestService");
                      }}
                    >
                      <div>Request Service</div>
                    </li>
                  ) : (
                    <li
                      class="hover:bg-gray-200 py-4 px-6 w-full"
                      onClick={() => navigate("/serviceSection")}
                    >
                      <div>Services</div>
                    </li>
                  )}
                  <li
                    class="hover:bg-gray-200 py-4 px-6 w-full"
                    onClick={() => {
                      navigate("/profileUser");
                    }}
                  >
                    <div>Profile</div>
                  </li>
                </ul>
              </div>
              {/* inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 */}
            </div>

            <div
              class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-cta"
            >
              <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <div
                    onClick={() => navigate("/")}
                    class="block py-2 pl-3 pr-4 text-black rounded md:bg-transparent  md:p-0 dark:text-white"
                    aria-current="page"
                  >
                    Home
                  </div>
                </li>
                {userType === "user" ? (
                  <li>
                    <div
                      onClick={() => navigate("/requestService")}
                      class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Request Service
                    </div>
                  </li>
                ) : (
                  <li>
                    <div
                      onClick={() => navigate("/serviceSection")}
                      class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Services
                    </div>
                  </li>
                )}
                {userType === "user" ? (
                  <li>
                    <div
                      onClick={() => navigate("/profileUser")}
                      class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Profile
                    </div>
                  </li>
                ) : (
                  <li>
                    <div
                      onClick={() => navigate("/profileHandymen")}
                      class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Profile
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
