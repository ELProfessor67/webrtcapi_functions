import { responseHandler } from "@shared/utils/responseHandler";
import { Request, Response } from "express";
import { createRoomIdService } from "../../services/room/roomService";

export const createRoomId = async (req: Request, res: Response) => {
  await responseHandler(res, createRoomIdService);
};
