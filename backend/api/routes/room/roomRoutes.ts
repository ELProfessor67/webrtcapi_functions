import express from "express";
import { createRoomId } from "../../controllers/room/roomController";

const router = express.Router();

router.get("/create-room-id", createRoomId);

export default router;
