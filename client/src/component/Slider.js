import React, { useEffect, useState } from "react";
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide8.jpg";
import slide5 from "../assets/slide5.jpg";
import slide6 from "../assets/slide6.jpg";
import larrow from "../assets/larrow.png";
import rarrow from "../assets/rarrow.png";

const Slider = () => {
  useEffect(() => {
    const handleNextClick = () => {
      let lists = document.querySelectorAll(".item");
      document.getElementById("slide").appendChild(lists[0]);
    };

    const handlePrevClick = () => {
      let lists = document.querySelectorAll(".item");
      document.getElementById("slide").prepend(lists[lists.length - 1]);
    };

    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");

    if (nextButton && prevButton) {
      nextButton.addEventListener("click", handleNextClick);
      prevButton.addEventListener("click", handlePrevClick);
    }

    return () => {
      if (nextButton && prevButton) {
        nextButton.removeEventListener("click", handleNextClick);
        prevButton.removeEventListener("click", handlePrevClick);
      }
    };
  }, []);

  return (
    <div className="  flex my-auto items-center  justify-evenly   transform translate-x-[0.002%] translate-y-[-40%] transition-all h-[90vh] mt-32 -mb-24 ">
      <div id="slide">
        {/* Your item components go here */}
        <div className="item" style={{ backgroundImage: `url(${slide1})` }}>
          <div className="content">
            <div className="name">Plumbing Service</div>
            <div className="w-16 h-1 mt-2 bg-[#EAB308]"></div>

            <div className="des text-[#000000] font-semibold">
              Experience unmatched expertise with our skilled team of licensed
              plumbers, dedicated to providing top-notch plumbing services
              tailored to meet your specific needs.
            </div>
          </div>
        </div>
        <div className="item" style={{ backgroundImage: `url(${slide2})` }}>
          <div className="content">
            <div className="name">Electric Support</div>
            <div className="w-16 h-1 mt-2 bg-[#EAB308]"></div>
            <div className="des text-[#000000] font-semibold">
              Empower your space with our expert electric service, where skilled
              professionals deliver a seamless range of electrical solutions to
              illuminate your home or business.
            </div>
          </div>
        </div>
        <div className="item" style={{ backgroundImage: `url(${slide3})` }}>
          <div className="content">
            <div className="name">Carpentry</div>
            <div className="w-16 h-1 mt-2 bg-[#EAB308]"></div>
            <div className="des text-[#000000] font-semibold">
              From concept to completion, our carpentry service takes pride in
              delivering high-quality woodcraft, turning ideas into reality with
              expertise, reliability, and a passion for the art of carpentry.
            </div>
          </div>
        </div>
        <div className="item" style={{ backgroundImage: `url(${slide4})` }}>
          <div className="content">
            <div className="name">Paint Service</div>
            <div className="w-16 h-1 mt-2 bg-[#EAB308]"></div>
            <div className="des text-[#000000] font-semibold">
              Transform your space with our professional painting service, where
              a palette of expertise meets your vision, creating vibrant and
              lasting impressions for your home or business.
            </div>
          </div>
        </div>
        <div className="item" style={{ backgroundImage: `url(${slide5})` }}>
          <div className="content">
            <div className="name">
              Apppliance Repairing
            </div>
            <div className="w-16 h-1 mt-2 bg-[#EAB308]"></div>
            <div className="des text-[#000000] font-semibold">
              Trust our appliance repair specialists to diagnose and resolve
              issues with precision, offering efficient solutions to keep your
              household running smoothly.
            </div>
          </div>
        </div>
        {/* <div className="item" style={{ backgroundImage: `url(${slide6})` }}>
          <div className="content">
            <button className="w-[8vw] rounded-3xl bg-amber-50 text-amber-500">
              <p className=" font-roboto  font-semibold text-base ">Coupons</p>
            </button>

            <div className="name">Personalised Discovery</div>
            <div className="des">
              Lorem ipsum dolor sit amet consectetur. Tincidunt scelerisque
              commodo proin faucibus.Lorem ipsum dolor sit amet consectetur.
              Tincidunt scelerisque commodo proin faucibus.
            </div>
          </div>
        </div> */}
      </div>

      <div className=" buttons w-[87%]  bottom-[6%] absolute z-10 flex flex-row space-x-2  ">
        <button id="prev">
          <img src={larrow} className="z-[100]"></img>
        </button>
        <button id="next">
          <img src={rarrow} className="z-[100]"></img>
        </button>
      </div>
    </div>
  );
};

export default Slider;
