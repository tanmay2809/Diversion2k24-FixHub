//import React, { useState } from "react";
//import axios from "axios"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { ImCross } from "react-icons/im";
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
const _DEV_ = document.domain === "localhost";

const Pricing = () => {
  const [name, setName] = useState("Mehul");

  // async function displayRazorpay() {
  //   const res = await loadScript(
  //     "https://checkout.razorpay.com/v1/checkout.js"
  //   );

  //   if (!res) {
  //     alert("Razorpay SDK failed to load. Are you online?");
  //     return;
  //   }

  //   const data = await fetch("http://65.0.30.70:5000/payment/razorpay", {
  //     method: "POST",
  //   }).then((t) => t.json());

  //   console.log(data);

  //   const options = {
  //     key: _DEV_ ? "rzp_test_35zy3Hqp4Jtv6M" : "PRODUCTION_KEY",
  //     currency: data.currency,
  //     amount: data.amount,
  //     order_id: data.id,
  //     name: "Donation",
  //     description: "Thank you for nothing. Please give us some money",
  //     image: "http://65.0.30.70:5000/logo.svg",
  //     handler: function (response) {
  //       alert(response.razorpay_payment_id);
  //       alert(response.razorpay_order_id);
  //       alert(response.razorpay_signature);
  //     },
  //     prefill: {
  //       name,
  //       email: "sdfdsjfh2@ndsfdf.com",
  //       phone_number: "9899999999",
  //     },
  //   };
  //   const paymentObject = new window.Razorpay(options);
  //   paymentObject.open();
  // }
const sid = JSON.parse(localStorage.getItem("user")).id;
  const plans = [
    {
      name: "Shahrukh Khan",
      pack: 100,
      price: 1200,
      features: ["Light, Fan"],
      date: "21/02/03",
    },
    {
      name: "Salman Khan",
      pack: 200,
      price: 2000,
      features: ["Light "],
      date: "21/02/03",
    },
    {
      name: "Amir Khan",
      pack: 500,
      price: 1500,
      features: ["Light, Fan, MCB"],
      date: "21/02/03",
    },
  ];


  const toast = useToast();

  const [data, setData] = useState();
  //const [sid , setSid] = useState()

  const getAllData = async () => {
    let config1 = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:5000/service/getServiceDetailUser/${sid}`,
      headers: {},
    };
    axios.request(config1)
      .then((response) => {
       console.log(response.data);
        setData(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllData();
  },[sid]);


  function openPopup() {
    document.getElementById('popup').style.display = "block";
    document.getElementById('background').style.filter = "blur(6Px)";
    document.getElementById('filter').style.opacity = "1";
    document.documentElement.scrollTop = 0;
  }
  function closePopup() {
    document.getElementById('popup').style.display = "none";
    document.getElementById('background').style.filter = "blur(0px)";
    document.getElementById('filter').style.opacity = "0";
  }

  const [rname, setRName] = useState('');
  const [email, setEmail] = useState('');
  // const [service, setService] = useState('');
  const [reason, setReason] = useState('');

  const [formData, setFormData] = useState({ rname: "", email: "",  reason: "", });
  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }
  function resetForm() {
    setFormData({ rname: "", email: "", reason: "", });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/saveCustomerSupport",
        formData,
        config
      );
      resetForm();
      closePopup();
      toast({
        title: "Message Sent",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }



  return (
    <>
      <div
        className=" top-20 lg:top-28 left-[5%] lg:left-[15%] z-[100] hidden"
        id="popup"
      >
        <div className="w-[90vw] lg:w-[50vw] mx-auto bg-[rgba(248,250,252,0.82)] pb-8 rounded-md flex justify-center items-center">
          <div className="w-[70vw] mx-auto lg:w-[70vw] h-fit flex flex-col gap-10">
            <div className="flex justify-between">
              <div></div>
              <div className="text-2xl lg:text-4xl text-center font-semibold font-roboto pt-2">
                Become a partner
              </div>
              <button onClick={closePopup} className="text-right p-2">
                <ImCross />
              </button>
            </div>
            <div className="w-[90%] lg:w-[80%] mx-auto bg-[#ffffff] rounded-md p-4 h-fit">
              <form onSubmit={submitHandler}>
                <div className="flex flex-col gap-10">
                  <div className="flex flex-row justify-between">
                    <div className="w-[49%] flex flex-col gap-3">
                      <label className="text-xs font-semibold font-roboto">
                        Handyman Name
                      </label>
                      <input
                        required
                        type="text"
                        name="rname"
                        onChange={changeHandler}
                        value={formData.rname}
                        className="w-full h-[50px] p-3 border border-[#E2E8F0] rounded-md focus:outline-none focus:shadow-md"
                      ></input>
                    </div>
                    <div className="w-[49%] flex flex-col gap-3">
                      <label className="text-xs font-semibold font-roboto">
                        Email address
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        onChange={changeHandler}
                        value={formData.email}
                        className="w-full h-[50px] p-3 border border-[#E2E8F0] rounded-md focus:outline-none focus:shadow-md"
                      ></input>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-full flex flex-col gap-3">
                      <label className="text-xs font-semibold font-roboto">
                        Describe your Issue
                      </label>
                      <textarea
                        required
                        type="text"
                        name="outlet"
                        onChange={changeHandler}
                        value={formData.outlet}
                        className="w-full h-24 p-3 border border-[#E2E8F0] rounded-md focus:outline-none focus:shadow-md"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <button className="w-[137px] h-[42px] bg-[#EAB308] border rounded-md px-[19px] py-[10px] flex justify-center items-center text-[#ffffff] font-roboto font-semibold tracking-tighter">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <section className="py-2 relative" id="background">
        <div className="max-w-screen-xl mx-auto text-gray-600 ">
          <div className="relative max-w-xl mx-auto sm:text-center">
            <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Service History
            </h3>
          </div>
          <div className="mt-16 space-y-6 justify-center items-center ">
            {plans.map((item, idx) => (
              <div
                key={idx}
                className="relative flex-1 flex flex-col justify-center p-2 rounded-xl border-2 "
              >
                <div className="flex justify-between ">
                  <div className="flex w-full justify-between items-center h-12">
                    <div className="text-indigo-600 font-medium">
                      {item.name}
                    </div>

                    <div className="flex ">
                      <p className="font-bold">Service: </p>
                      <ul className="ml-3 space-y-3">
                        {item.features.map((featureItem, idx) => (
                          <li key={idx} className="flex items-center gap-5">
                            {featureItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold">Date:</span>
                      {item.date}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex py-[6px]">
                    <div>Amount Earned:</div>
                    <div className=" text-gray-800 text-base font-semibold">
                      {item.price}
                    </div>
                  </div>
                  <div className="">
                    <button
                      className="bg-[#EAB308] text-[#000000]  py-[6px] px-[8px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200"
                      onClick={openPopup}
                    >
                      Help & Support
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;