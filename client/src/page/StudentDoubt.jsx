import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
// import Pro from '../component/doubtForm';
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
function StudentDoubt() {

  const [selectedCategory, setSelectedCategory] = useState('Electrician');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [price, setPrice] = useState(null);

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

  // const onClickHandler = (event) => {
  //   event.preventDefault();
  //   setPrice(calculateTotalPrice(selectedOptions, quantities));
  //   console.log(`Submitted data: ${selectedCategory},${JSON.stringify(selectedOptions)},${quantities},${price}`);
  // };

  useEffect(() => {
    console.log(`Updated data: ${selectedCategory},${JSON.stringify(selectedOptions)},${price}`);
  }, [selectedCategory, selectedOptions, price]);

  const studentId = JSON.parse(localStorage.getItem("user")).id;
  const authToken = localStorage.getItem("token");
  const [question, setQuestion] = useState("");
  const resultRef = useRef();
  const navigate = useNavigate();
  const [rates, setRates] = useState([]);
  useEffect(() => {
  }, []);
  socket.emit("studentConnected", { studentId });

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
    console.log("questionAsked", question, studentId, selectedCategory);
    const lat = JSON.parse(localStorage.getItem("user")).lat;
    const lon = JSON.parse(localStorage.getItem("user")).lon;
    const a = JSON.stringify(selectedOptions);
    const b = JSON.stringify(quantities);
    console.log(a);
    socket.emit("questionAsked", { selectedCategory, studentId, lat, lon, a, b, price, question });
    setQuestion("");
    // resultRef.current.innerText = "Waiting for handymen to accept...";
  };

  function handleAccept(teacherId, studentId) {
    socket.emit('moveToChatStudent', { studentId, teacherId });
    setQuestion("");
  };

  function handleDecline(teacherId) {
    setRates((prevRates) =>
      prevRates.filter((rate) => rate.teacherId == teacherId)
    );
  }

  socket.on('moveToChat', (payload) => {
    console.log("moving to chat");
    navigate("/chat", { state: { value1: payload.studentId, value2: payload.teacherId } });
  });

  return (
    <div className='pt-28'>
      <div className="flex justify-center text-4xl p-6 font-semibold">
        ASK FOR SERVICE
      </div>
      {/* <div><Pro /></div> */}

      <form className="flex flex-col justify-evenly h-1/2 gap-[2rem] pb-20" onSubmit={sendQuestion}>
        <div className="flex flex-col space-x-4 mt-11">
          <div className="">
            <label htmlFor="category" className="font-bold">
              Choose the service type
            </label>
            <br />
            <select
              className="... ring-2 ring-inset ring-gray-800 w-36 rounded-md mt-3 px-3 py-2 text-center"
              name="category"
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory &&
            categories[selectedCategory].map((item, index) => (
              <div key={item.name} className="flex flex-row items-center mt-4">
                <div className="w-3/4 mr-4">
                  <input
                    type="text"
                    value={item.name}
                    readOnly
                    className="bg-gray-200 rounded-md px-3 py-2 text-center"
                  />
                </div>
                <div className="w-1/4 flex items-center space-x-4">
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
                    className="w-20 border-slate-900 outline-double rounded-md px-2 py-1 text-center"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          <input
            className="w-[60%] mx-auto border border-black rounded-lg p-4 m-4"
            type="text"
            name="chat"
            placeholder="domain"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
          <div className="my-4 flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={sendQuestion}
            >
              Submit
            </button>
          </div>
          <div className="mt-4">
            <label className="font-bold">Total Price:</label>
            <input
              type="text"
              value={price}
              readOnly
              className="bg-gray-200 rounded-md px-3 py-2 text-center"
            />
          </div>
        </div>
      </form>

      {/* <div className="flex justify-center w-full p-6">
        <header
          className="App-header border-black bg-slate-200 rounded-2xl p-12 shadow-xl"
          ref={resultRef}
        >
          <form onSubmit={sendQuestion}>
            <input
              className="border-black rounded-lg p-4 m-4"
              type="text"
              name="chat"
              placeholder="domain"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            />
            <button
              type="submit"
              className=" rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              ASK
            </button>
          </form>
        </header>
      </div> */}
      <div>
        {/* <ul>
          {rates.map((rate) => (
            <li key={rate._id}>
              Fare: {rate.payload.fare}
              {!rate.accepted && (
                <>
                  <button onClick={() => handleAccept(rate.payload.teacherId, rate.payload.studentId)}>Accept</button>
                  <button onClick={() => handleDecline(rate.payload.teacherId)}>Decline</button>
                </>
              )}
            </li>
          ))}
        </ul> */}

        <ul>
          {[...new Set(rates.map(rate => rate.payload.fare))].map((uniqueFare) => {
            const uniqueRate = rates.find(rate => rate.payload.fare === uniqueFare);
            return (
              <li key={uniqueRate._id}>
                Fare: {uniqueRate.payload.fare}
                {!uniqueRate.accepted && (
                  <>
                    <button onClick={() => handleAccept(uniqueRate.payload.teacherId, uniqueRate.payload.studentId, uniqueRate.payload.fare, question)}>Accept</button>
                    <button onClick={() => handleDecline(uniqueRate.payload.teacherId)}>Decline</button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default StudentDoubt;