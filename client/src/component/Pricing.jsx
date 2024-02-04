//import React, { useState } from "react";
//import axios from "axios"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { ImCross } from "react-icons/im";

const Pricing = () => {
  const [name, setName] = useState("");
const sid = JSON.parse(localStorage.getItem("user")).id;
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
       console.log(response?.data);
        setData(response?.data?.data)
      })
      .catch((error) => {
        console.log(error);
      });
     
  };

  useEffect(() => {
    getAllData();
  },[]);

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
        "http://localhost:5000/support/saveCustomerSupport",
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
                Lodge your Complaint
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
            {data &&
              data.map((item, idx) => (
                <div key={idx} className="border p-2 flex justify-between">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-5 ">
                      HandymenName : {item.tid.name}
                    </div>
                    <div>Service_type :{item.service_type[0]}</div>
                  </div>
                  <div className=" text-gray-800 text-base font-semibold -translate-x-28">
                    fare :{item.fare}
                  </div>
                  <div>
                    <button
                      className="bg-[#EAB308] text-[#000000]  py-[6px] px-[8px] rounded-md font-mullish font-bold
          hover:bg-lightBlue500 transition-all duration-200"
                      onClick={openPopup}
                    >
                      Get Help
                    </button>
                  </div>
                </div>
              ))}
            {!data && (
              <div className="text-center ">No services provided yet...</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
