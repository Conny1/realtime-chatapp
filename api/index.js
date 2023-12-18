import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./utils/db.js";
import AuthRoute from "./Routes/Auth.js";

dotenv.config();
const app = express();
// middlwares
app.use(cors());
app.use(express.json());

// endpoints
app.use("/auth", AuthRoute);

app.use((err, req, resp, next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";

  return resp.status(status).json({
    success: false,
    status: status,
    message: err.message,
    stack: err.stack,
  });
});

app.listen(process.env.PORT, async () => {
  console.log("Connected to port" + process.env.PORT);

  await connect();
});
