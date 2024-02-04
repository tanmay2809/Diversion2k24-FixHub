import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
// import Pro from '../component/doubtForm';
import { LoginContext } from "../contexts/LoginContext";
const socket = io.connect(`${process.env.REACT_APP_SOCKET_BASE_URL}`);

const categories = {
  Electrician: [
    { name: 'Wiring (per 5 metres)', price: 20 },
    { name: 'Fan', price: 50 },
    { name: 'Light', price: 30 },
    { name: 'MCB', price: 40 },
  ],
  Plumber: [
    { name: 'Toilet', price: 100 },
    { name: 'Water Tank', price: 150 },
    { name: 'Motor', price: 200 },
    { name: 'Water Connections', price: 80 },
  ],
  Painter: [
    { name: 'Wall Area (per sq. metres)', price: 15 },
  ],
};
function UserRequest() {
  const { userno, setUserno } = useContext(LoginContext);
  const [pic, setPic] = useState();
  const [selectedCategory, setSelectedCategory] = useState('Electrician');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [price, setPrice] = useState(null);

  const postDetails = async (pics) => {
    let result;
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app");

      return (
        axios
          .post(
            'https://api.cloudinary.com/v1_1/dqclqq2jy/image/upload/',
            data,
            {
              onUploadProgress: (ProgressEvent) => { },
            }
          )
          //.then((res) => res.json())

          .then(({ data }) => {
            data.secure_url = "" + data.secure_url;
            //setPic(data.secure_url.toString());
            console.log(data.url.toString());
            setPic(data.url.toString());
            console.log("UPLOAD COMPLETE: " + JSON.stringify(result));

            console.log(pic)
          })
          .catch((err) => {
            console.log(err);

          })
      );
    } else {

      return;
    }
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setSelectedOptions(categories[newCategory].map(item => item.name));
    setQuantities(categories[newCategory].map(() => 0));
    setPrice(null);
  };

  const handleOptionChange = (index, event) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = event.target.value;
    setSelectedOptions(newSelectedOptions);
    setPrice(calculateTotalPrice(newSelectedOptions, quantities));
  };

  const handleQuantityChange = (index, event) => {
    const newQuantities = [...quantities];
    newQuantities[index] = parseInt(event.target.value) || 0;
    setQuantities(newQuantities);
    setPrice(calculateTotalPrice(selectedOptions, newQuantities));
  };

  const calculateTotalPrice = (options, quantities) => {
    let totalPrice = 0;
    options.forEach((option, index) => {
      const item = categories[selectedCategory].find(
        (item) => item.name === option
      );
      const itemPrice = item ? item.price : 0;
      const quantity = quantities[index] || 0;
      totalPrice += itemPrice * quantity;
    });
    return totalPrice;
  };

  useEffect(() => {
    console.log(`Updated data: ${selectedCategory},${JSON.stringify(selectedOptions)},${price}`);
  }, [selectedCategory, selectedOptions, price]);

  const userId = JSON.parse(localStorage.getItem("user")).id;
  const authToken = localStorage.getItem("token");
  const [service, setQuestion] = useState("");
  const resultRef = useRef();
  const navigate = useNavigate();
  const [rates, setRates] = useState([]);
  useEffect(() => {
  }, []);
  socket.emit("studentConnected", { userId });

  socket.on("raiseFare", (payload) => {
    console.log(JSON.parse(localStorage.getItem("user")));
    console.log("payload :", payload);
    console.log("inside raise rates event");
    setRates((prevRates) => [...prevRates, payload]);
    console.log(rates);
  });

  const sendQuestion = (e) => {
    e.preventDefault();
    setPrice(calculateTotalPrice(selectedOptions, quantities));
    console.log("local storage : ", JSON.parse(localStorage.getItem("user")));
    console.log(`Submitted data: ${selectedCategory},${JSON.stringify(selectedOptions)},${quantities},${price}`);
    console.log("questionAsked", service, userId, selectedCategory);
    const lat = JSON.parse(localStorage.getItem("user")).lat;
    const lon = JSON.parse(localStorage.getItem("user")).lon;
    const a = JSON.stringify(selectedOptions);
    const b = JSON.stringify(quantities);
    console.log(a);
    socket.emit("questionAsked", { selectedCategory, userId, lat, lon, a, b, price, service, pic });
    setQuestion("");
    // resultRef.current.innerText = "Waiting for handymen to accept...";
  };

  function handleAccept(handymenId, userId, price, service, selectedCategory) {
    socket.emit('moveToChatStudent', { userId, handymenId, price, service, selectedCategory });
    setQuestion("");
  };

  function handleDecline(handymenId) {
    setRates((prevRates) =>
      prevRates.filter((rate) => rate.handymenId === handymenId)
    );
  }

  socket.on('movetoHome', () => {
    console.log("move to home");
    let u = JSON.parse(localStorage.getItem("user"));
    u.messages = [];
    u.data = [];
    localStorage.setItem("user", JSON.stringify(u));
    setUserno(2);
    navigate("/");
  });

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
    <div className='pt-28'>
      <div className="flex justify-center text-4xl p-6 font-semibold">
        ASK FOR SERVICE
      </div>

      <form className="flex flex-col justify-evenly h-1/2 gap-[2rem] pb-20" onSubmit={sendQuestion}>
        <div className="flex flex-col space-x-4 mt-11">
          <div className="p-4 border-2 w-[40%] mx-auto shadow-md">
            <div className="flex justify-center mx-auto ">
              <div className="">
                <label htmlFor="category" className="font-bold p-2 text-xl">
                  Choose the service type
                </label>
                <select
                  className="... ring-2 ring-inset ring-gray-800 rounded-md mt-3 w-32 p-1 text-lg text-center"
                  name="category"
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category} className="text-xl">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="">
              {selectedCategory &&
                categories[selectedCategory].map((item, index) => (
                  <div key={item.name} className="flex flex-row items-center justify-center mt-4 border w-[332px] ml-[100px]">
                    <div className="mr-4">
                      <input
                        type="text"
                        value={item.name}
                        readOnly
                        className="px-3 py-2 text-center"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <select
                        value={selectedOptions[index] || ''}
                        onChange={(e) => handleOptionChange(index, e)}
                      // className="w-20 border-slate-900 outline-double rounded-md px-2 py-1 text-center"
                      >
                        {/* <option value="">Select</option> */}
                      </select>
                      <input
                        type="number"
                        min={0}
                        value={quantities[index] || ''}
                        onChange={(e) => handleQuantityChange(index, e)}
                        className="w-20 border-md p-1 text-center"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
            </div>
          <textarea
            className="w-[342px]  h-20 mt-4 flex justify-center mx-auto border"
            type="text"
            name="chat"
            placeholder="describe your problem"
            value={service}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
        <div>
          <input
            className="w-[342px] h-16 flex justify-center mx-auto border  p-4 m-4"
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>
            </div>
        <div className="mt-4 flex justify-center space-x-20">
          <div className="">
            <button
              type="submit"
              className="bg-[#EAB308] text-[#000000]  ml-3 py-[10px] px-[28px] rounded-md font-bold
          hover:bg-lightBlue500 transition-all duration-200"
              onClick={sendQuestion}
            >
              Submit
            </button>
          </div>
          <div className="">
            <label className="font-bold">Total Price:</label>
            <input
              type="text"
              value={price}
              readOnly
              className="border px-3 py-2 text-center"
            />
          </div>
          </div>
          </div>
      </form >

      <div className="">
        <ul>
          {[...new Set(rates.map(rate => rate.payload.fare))].map((uniqueFare) => {
            const uniqueRate = rates.find(rate => rate.payload.fare === uniqueFare);
            return (
              <div className="flex justify-center">
                <li
                  className="border w-[20%] flex-col justify-center mb-4"
                  key={uniqueRate._id}>
                  <div className="flex justify-center text-xl">
                    <span>Fare:</span>
                    {uniqueRate.payload.fare}
                  </div>
                  {!uniqueRate.accepted && (
                    <div className="flex justify-center">
                      <button onClick={() => handleAccept(uniqueRate.payload.handymenId, uniqueRate.payload.userId, uniqueRate.payload.fare, service, selectedCategory)}
                        className="bg-[#38A169] text-white p-2 m-2 w-24 rounded-full "
                      >Accept</button>
                      <button onClick={() => handleDecline(uniqueRate.payload.handymenId)}
                        className="bg-[#EF4444] text-white p-2 m-2 ml-0 w-24 rounded-full"
                      >Decline</button>
                    </div>
                  )}
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div >
  );
}

export default UserRequest;
