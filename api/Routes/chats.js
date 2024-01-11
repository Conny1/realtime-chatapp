import express from "express";
import {
  AccessChats,
  addgroup,
  creategroup,
  fetchChats,
  getAllusers,
  removeFromgroup,
  renamegroup,
} from "../Controlers/Chats.js";
import {
  VerifyTokens,
  verifgroupAdmin,
  verifyUser,
} from "../utils/VerifyTokens.js";

const Router = express.Router();

Router.get("/getallusers", VerifyTokens, getAllusers);
Router.post("/accesschats", VerifyTokens, AccessChats);

Router.get("/fetchchats/:id", verifyUser, fetchChats);
Router.post("/creategroup", VerifyTokens, creategroup);
Router.put("/renamegroup/:id", verifgroupAdmin, renamegroup);
Router.put("/adduserstogroup/:id", verifgroupAdmin, addgroup);
Router.put("/removeuserfromgroup/:id", verifgroupAdmin, removeFromgroup);

export default Router;
