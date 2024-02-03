const app = require("express")();
const server = require("http").createServer();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  let studentId;
  let question;
  let teacherId;
  let tutorsVisited;

  //if conn with a student socket
  socket.on("studentConnected", (payload) => {
    studentId = payload.studentId;
    socket.join(studentId);
  });

  socket.on("questionAsked", (payload) => {
    console.log("payload : ",payload);
    selectedCategory = payload.selectedCategory;
    studentId = payload.studentId;
    lat = payload.lat;
    lon = payload.lon;
    options = payload.a;
    quantities = payload.b;
    price=payload.price;
    question=payload.question;
    let filteredOptions =[];
    let filteredQuantities=[];
    // if (Array.isArray(options) && Array.isArray(quantities) && options.length === quantities.length) {
    //    filteredOptions = options.filter((_, index) => quantities[index] !== 0);
    //    filteredQuantities = quantities.filter(quantity => quantity !== 0);
    // }
    // let filteredOptions = options.filter((_, index) => quantities[index] !== 0);
    // let filteredQuantities = quantities.filter(quantity => quantity !== 0);
    console.log(`question asked by ${studentId}: ${question}`);
    console.log( studentId, selectedCategory,lat,lon,options,quantities,price,question );
    socket.to("tutors").emit("questionAvailable", { studentId, selectedCategory,lat,lon,options,quantities,price,question });
  });

  //if conn with a teacher socket
  socket.on("teacherOnline", (payload) => {
    teacherId = payload.teacherId,
    console.log("teacher ", teacherId, " is online");
    // teacherId = payload.teacherId;
    socket.join(teacherId);
    socket.join("tutors");
  });
  socket.on("questionAccepted", (payload) => {
    studentId = payload.studentId;
    teacherId = payload.teacherId;
    io.to("tutors").emit("removeQuestion", { studentId });
    io.to(studentId).to(teacherId).emit("moveToCall", { studentId, teacherId });
    // socket.to(teacherId).emit("moveToCall", { studentId, teacherId });
  });

  socket.on("raiseRates",(payload) => {
    // console.log(payload.studentId);
    console.log("raise rates payload ",payload);
    io.to(payload.studentId).emit("raiseFare",{payload});
  });

  socket.on('moveToChatStudent', (payload) => {
    const {studentId,teacherId} = payload;
    io.to("tutors").emit("removeQuestion", { studentId });
    io.to(teacherId).to(studentId).emit('moveToChat', { studentId,teacherId });
  });

  socket.on('moveToChatTeacher',(payload)=> {
    const {studentId,teacherId,price,question} = payload;
    io.to("tutors").emit("removeQuestion", { studentId });
    io.to(teacherId).to(studentId).emit('moveToChat', { studentId,teacherId,price,question });
  });

  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  });
});

server.listen(4000, () => {
  console.log("server active at 4000...");
});
