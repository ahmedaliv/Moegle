import Fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import { fastifyCors } from '@fastify/cors'
import { Socket } from "socket.io";
import 'dotenv/config'
import { setupSocketIO } from "./lib/socket/index.js";


const server = Fastify({
  logger: true,
},);


server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});
//@ts-ignore
server.register(fastifyIO, {
  cors: {
    origin: `*`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

server.ready().then(() => {
  // Pass the io object to the setupSocketIO function
  setupSocketIO(server.io);
});
// Run the server!
server.listen({
  host: "0.0.0.0"
  , port: 3005
}, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}
