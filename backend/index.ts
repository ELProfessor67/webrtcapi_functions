import { config } from "dotenv";
import http from "http";
import express from "express";
import routes from "api/routes";
import { initMediasoup } from "api/config/mediasoupConfig";
import initChatServer from "api/config/chatConfig";
config();

const MPORT = Number(process.env.MEDIASOUP_PORT || 4000);
const CPORT = Number(process.env.CHAT_PORT || 4001);

const app = express();

/* ----------------REST APIs Routes---------------- */
app.use("/api/v1", routes);

/* ----------------Server (Mediasoup + REST)---------------- */
const server = http.createServer(app);
initMediasoup(server);

server.listen(MPORT, () => {
  console.log(`Mediasoup Server Running on port ${MPORT}`);
});

/* ----------------Chat Server---------------- */
const chatApp = express();
const chatHttpServer = http.createServer(chatApp);
initChatServer(chatHttpServer);

chatHttpServer.listen(CPORT, () => {
  console.log(`Chat Server Running on port ${CPORT}`);
});
