import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./utils/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, async () => {
  console.log("Connected to port" + process.env.PORT);

  await connect();
});
