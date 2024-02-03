const app = require("express")();
const server = require("http").createServer();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  let userId;
  let service;
  let handymenId;

  socket.on("studentConnected", (payload) => {
    userId = payload.userId;
    socket.join(userId);
  });

  socket.on("questionAsked", (payload) => {
    console.log("payload : ",payload);
    selectedCategory = payload.selectedCategory;
    userId = payload.userId;
    lat = payload.lat;
    lon = payload.lon;
    options = payload.a;
    quantities = payload.b;
    price=payload.price;
    pic=payload.pic;
    service = payload.service;
    console.log(`service asked by ${userId}: ${service}`);
    console.log(
      userId,
      selectedCategory,
      lat,
      lon,
      options,
      quantities,
      price,
      service
    );
    socket.to("tutors").emit("questionAvailable", {
      userId,
      selectedCategory,
      lat,
      lon,
      options,
      quantities,
      price,
      service,
      pic,
    });
  });

  //if conn with a teacher socket
  socket.on("teacherOnline", (payload) => {
    handymenId = payload.handymenId,
      console.log("teacher ", handymenId, " is online");
    socket.join(handymenId);
    socket.join("tutors");
  });
  socket.on("questionAccepted", (payload) => {
    userId = payload.userId;
    handymenId = payload.handymenId;
    io.to("tutors").emit("removeQuestion", { userId });
    io.to(userId).to(handymenId).emit("moveToCall", { userId, handymenId });
  });

  socket.on("raiseRates",(payload) => {
    // console.log(payload.studentId);
    console.log("raise rates payload ",payload);
    io.to(payload.userId).emit("raiseFare", { payload });
  });

  socket.on('moveToChatStudent', (payload) => {
    const { userId, handymenId, price, service, selectedCategory } = payload;
    io.to("tutors").emit("removeQuestion", { userId });
    io.to(handymenId).to(userId).emit("moveToChat", {
      userId,
      handymenId,
      price,
      service,
      selectedCategory,
    });
  });

  socket.on('moveToChatTeacher',(payload)=> {
    const { userId, handymenId, price, service, selectedCategory } = payload;
    io.to("tutors").emit("removeQuestion", { userId });
    io.to(handymenId).to(userId).emit("moveToChat", {
      userId,
      handymenId,
      price,
      service,
      selectedCategory,
    });
  });

  socket.on('chat message', (msg) => {
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('moveToHomeHandymen',(payload) => {
    console.log(payload);
    console.log("moving home : ",payload);
    io.to(payload).emit("movetoHome");
  });

});

server.listen(4000, () => {
  console.log("server active at 4000...");
});
