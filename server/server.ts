import Fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import { fastifyCors } from '@fastify/cors'
import 'dotenv/config'
import { setupSocketIO } from "./lib/socket/index.js";
import http  from "http";

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


// Health check scheduler
const pingHealthCheckScheduler = (() => {
  let pingCount = 0;

  // Health check route
  server.get('/health', async (request, reply) => {
    pingCount++; 
    return { status: 'ok' };
  });

  // ping function 
  const pingHealthCheck = () => {
    http.get('http://localhost:3005/health', (res) => {
      console.log(`Ping ${pingCount} to health check endpoint. Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Error pinging health check endpoint: ${err.message}`);
    });
  };

  // Reset pingCount every 24 hours (86400000 milliseconds)
  const resetPingCount = () => {
    pingCount = 0;
  };

  // Ping health check endpoint every 10 minutes
  setInterval(pingHealthCheck, 60000);

  // Reset pingCount every 24 hours
  setInterval(resetPingCount, 86400000);

})();
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
