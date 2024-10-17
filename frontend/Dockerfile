FROM node

WORKDIR /app/frontend

COPY . /app/frontend/

RUN npm install
RUN  npm run build


ENV NEXT_PUBLIC_SOCKET_URL=mediasoup_server_url
ENV NEXT_PUBLIC_CHAT_SOCKET_URL=chat_server_url
EXPOSE 3000

CMD [ "npm","run","start" ]