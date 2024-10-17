import { themeMessages } from "@shared/constants/messages";
import generateRandomString from "@shared/utils/generateRandomString";

export const createRoomIdService = async (): Promise<Object> => {
  try {
    const roomId = generateRandomString();

    return {
      status: 200,
      message: "Created a room ID.",
      data: {
        roomId,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: themeMessages.InternalServerError,
    };
  }
};
