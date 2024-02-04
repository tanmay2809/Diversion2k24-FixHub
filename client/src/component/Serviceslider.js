import React, { useState, useEffect } from "react";

import service1 from "../assets/service1.jpg"
import service2 from "../assets/service2.jpg";
import service3 from "../assets/service3.jpg";
import service4 from "../assets/service4.jpg";
import service5 from "../assets/service5.avif";

function TeamSlider() {
  

  const team = [
    { src: service1, name:"Plumbing" },
    { src: service2, name: "Carpentry" },
    { src: service3, name: "Electric Support" },
    { src: service4, name: "Painting" },
    { src: service5, name: "AC repair" },
   
  ];

 

  return (
    <div className="overflow-x-auto whitespace-nowrap scroll-wheel">
      <div className="flex" style={{ width: team.length * 310 }}>
        {team.map((image, index) => (
          <div key={index} className="relative w-[18.75rem] h-[23rem] m-1">
            <img
              src={image.src}
              alt={image.alt}
              className="w-[18.75rem] h-[18.75rem] mr-3"
            />
            <p className="font-roboto text-base font-medium">{image.name}</p>
            <p className="font-sans text-sm font-normal">{image.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamSlider;
