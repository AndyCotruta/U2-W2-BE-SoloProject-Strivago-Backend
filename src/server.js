import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
  forbiddenErrorHandler,
} from "./errorHandlers.js";
import usersRouter from "./services/users/index.js";

const server = express();

const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

// ..................ENDPOINTS..................

server.use("/users", usersRouter);

// ..................ERROR HANDLERS............

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(forbiddenErrorHandler); //403
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is listening on port: ${port}`);
  });
});
