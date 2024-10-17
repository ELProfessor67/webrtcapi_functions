import express from "express";
import roomRoutes from "./room/roomRoutes";

const route = express.Router();

route.use("/room", roomRoutes);

export default route;
