import express from "express";
import { getallmessages, sendMessage } from "../Controlers/Message.js";
import { VerifyTokens } from "../utils/VerifyTokens.js";

const Router = express.Router();

Router.post("/sendmessage", VerifyTokens, sendMessage);

Router.get("/getmessages/:chatid", VerifyTokens, getallmessages);

export default Router;
