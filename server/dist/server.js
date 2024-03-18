import Fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { fastifyCors } from '@fastify/cors';
import 'dotenv/config';
const server = Fastify({
    logger: true,
});
server.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});
//@ts-ignore
server.register(fastifyIO, {
    cors: {
        origin: `${process.env.CLIENT_URL}`,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});
server.get("/ ", (req, reply) => {
    server.io.emit("hello");
});
const waitingUsers = [];
server.ready().then(() => {
    // we need to wait for the server to be ready, else `server.io` is undefined
    server.io.on("connection", (socket) => {
        waitingUsers.push(socket);
        console.log(`New connection -> ${socket.id}, Total connections -> ${waitingUsers.length}`);
        if (waitingUsers.length >= 2) {
            const [indexA, indexB] = getRandomPairIndices(waitingUsers.length);
            const userA = waitingUsers.splice(indexA, 1)[0];
            const userB = waitingUsers.splice(indexB - 1, 1)[0];
            userA.emit("matched", { type: "video", initiator: true });
            userB.emit("matched", { type: "video", initiator: false });
            userA.on("offerToRemote", (data) => {
                userB.emit("receiveOffer", {
                    offer: data.offer,
                });
            });
            userB.on("answerSentToServer", (data) => {
                userA.emit("answerReceivedFromServer", {
                    answer: data.answer,
                });
            });
            userA.on("candidateToServer", (data) => {
                userB.emit("receiveCandidate", {
                    candidate: data.candidate,
                });
            });
            userB.on("candidateToServer", (data) => {
                userA.emit("receiveCandidate", {
                    candidate: data.candidate,
                });
            });
        }
        socket.on("disconnect", async () => {
            console.log("socket disconnect");
        });
        socket.on("error", async (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
});
// Run the server!
server.listen({ port: 3005 }, function (err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
function getRandomPairIndices(maxIndex) {
    const indexA = Math.floor(Math.random() * maxIndex);
    let indexB = Math.floor(Math.random() * maxIndex);
    while (indexB === indexA) {
        indexB = Math.floor(Math.random() * maxIndex);
    }
    return [indexA, indexB];
}
//# sourceMappingURL=server.js.map