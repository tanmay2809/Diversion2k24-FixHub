import React from "react";
import { useNavigate } from "react-router-dom";
import tools from "../assets/9596420-removebg-preview.png"
import Slider from "../component/Slider";
import { FaTools } from "react-icons/fa";

import Serviceslider from "../component/Serviceslider"

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative bg-deepBlue">

      <div className="w-10/12 max-w-[1080px] flex flex-col lg:flex-row justify-between items-center mx-auto ">
        {/* <!--left part--> */}
        <div className="space-y-8">
          <h1 className="font-mullish font-bold text-[50px] leading-[1.2] text-[#ffffff]"> Your Home,Our Expertise
          </h1>
          <div className="w-10 h-1 bg-[#EAB308]"></div>
          <p class="font-mullish text-[20px]  text-[#ffffff] opacity-70">
           "From Fixes to Flourishes: Your Home's Handy Heroes are Just a Click Away!" 
          </p>
          <button className="bg-[#EAB308] text-[#000000]  py-[14px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200">Get Started</button>
        </div>
        {/* <!--right part--> */}
       <img src={tools} alt="" className="w-full max-w-[680px]"></img> 
      </div>
        
     </div>

      <section className="text-gray-100 body-font mt-6 mb-4 border-[#000000]   bg-lightGray w-full">
        <div className="container px-5 py-24 mx-auto">
          
          <div className="lg:w-[80%] flex flex-col space-x-4 sm:flex-row sm:items-center items-start mx-auto">
            <FaTools className="w-[135px] h-[50px] my-auto -px-5"  />
            <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">
            Elevate your handyman career – sign up now for a world of opportunities and clients seeking your expertise!
            </h1>
            <button
              onClick={() => navigate("/signupHandymen")}
              className="bg-[#EAB308] text-[#000000]  py-[4px] px-[24px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200 text-lg sm:mt-0 m-3"
            >
              SignUp as Handymen
            </button>
            <button
              onClick={() => navigate("/handymen/login")}
              className="bg-[#EAB308] text-[#000000] w-[150px] py-[18px] px-[18px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200  text-lg sm:mt-0 m-3"
            >
              Login
            </button>
          </div>
        </div>
      </section>
      <section className="flex flex-col w-full mx-auto">
       
        <h1 className=" font-mullish font-bold text-[50px] mx-auto  text-[#000000] "> Our Services
          <div className="w-16 h-1 -mb-16 bg-[#EAB308]"></div>
        </h1>
        
       
      <div className="mt-60">
          <Slider/>
      </div>
      </section>
      
         <section className="flex flex-col w-full">
       
        <h1 className=" font-mullish font-bold text-[50px] mx-auto  text-[#000000] "> Book Our Services
          <div className="w-16 h-1 -mb-4 bg-[#EAB308]"></div>
        </h1>

                
                
                <div className="mx-24 mt-14">
                    <Serviceslider/>
                </div>
            
      </section>
        
    </>
  );
};

export default Home;
