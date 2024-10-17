import consumerManager from "../webRTC/manageConsumersProcessor";

export const resumeMedia = async ({ serverConsumerId }: { serverConsumerId: string }) => {
  try {
    const consumer = consumerManager.findConsumerById(serverConsumerId);
    await consumer?.resume();
  } catch (error) {
    console.log("Error while resume media: ", (error as Error).message);
  }
};
