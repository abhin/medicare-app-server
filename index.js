import server from "./server.js";
import db from "./db.js";

const PORT = process.env.PORT || 8080;

db.then(() => {
  server.listen(PORT, () => {
    console.log(
      `DB connection is success. Server is listening on port: ${PORT}`
    );
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});
