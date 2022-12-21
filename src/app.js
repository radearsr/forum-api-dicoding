require("dotenv").config();
const createServer = require("./Infrastructures/http/createServer");
const container = require("./Infrastructures/container");

(async () => {
  const server = await createServer(container);
  await server.start();
  console.info(`server start at ${server.info.uri}`);
})();
