import express from "express";
import { Login, Register } from "../Controlers/Auth.js";

const Router = express.Router();

Router.post("/register", Register);
Router.post("/login", Login);

export default Router;
