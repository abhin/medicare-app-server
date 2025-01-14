import {httpServer} from "./socketIO/connect.js";
import db from "./db.js";

const PORT = process.env.PORT || 8080;

db.then(() => {
  httpServer.listen(PORT, () => {
    console.log(
      `DB connection is success. Server is listening on port: ${PORT}`
    );
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});
