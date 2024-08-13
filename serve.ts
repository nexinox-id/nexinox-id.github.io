import Server from "lume/core/server.ts";

const server = new Server({});

server.start();

console.log("Listening on http://localhost:8000");
