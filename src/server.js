require("dotenv").config();

const tasksSocketRoutes = require("./socketRoutes/tasks");
const dogsSocketRoutes = require("./socketRoutes/dogs");
const eventsSocketRoutes = require("./socketRoutes/events");
const usersSocketRoutes = require("./socketRoutes/users");
const dogTasksSocketRoutes = require("./socketRoutes/dogTasks");
const eventTemplatesSocketRoutes = require("./socketRoutes/eventTemplates");
const notificationsSocketRoutes = require("./socketRoutes/notifications");
const usersRoutes = require("./routes/users");

const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.use(cors());

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);

  next();
});

app.use("/users", usersRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");

    // app listener
    server.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

io.use((socket, next) => {
  // TODO: check if is valid jwt token
  // try {
  //   const {_id} = jwt.verify(socket.handshake.auth.token, process.env.SECRET)
  //   next();
  // } catch (e) {
  //   next(new Error("UNAUTHORIZED"))
  // }

  next();
});

io.on("connection", (socket) => {
  if (socket.handshake.query.token) {
    const tokenData = jwt.decode(socket.handshake.query.token);

    if (!tokenData) return;

    socket.join(tokenData.team);

    dogsSocketRoutes(io, socket);
    eventsSocketRoutes(io, socket);
    usersSocketRoutes(io, socket);
    tasksSocketRoutes(io, socket);
    dogTasksSocketRoutes(io, socket);
    eventTemplatesSocketRoutes(io, socket);
    notificationsSocketRoutes(io, socket);
  }
});

// TODO: later create WS emit message "error" and every time somethings is invalid emit that message with error test
