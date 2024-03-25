import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Ph Health Care Server is running at port: ", config.port);
  });
}

main();
