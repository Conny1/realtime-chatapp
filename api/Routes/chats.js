import express from "express";
import {
  AccessChats,
  addgroup,
  creategroup,
  fetchChats,
  removeFromgroup,
  renamegroup,
} from "../Controlers/Chats.js";

const Router = express.Router();

Router.post("/accesschats", AccessChats);
Router.get("/fetchchats/:id", fetchChats);
Router.post("/creategroup", creategroup);
Router.put("/renamegroup/:id", renamegroup);
Router.put("/adduserstogroup/:id", addgroup);
Router.put("/removeuserfromgroup/:id", removeFromgroup);

export default Router;
