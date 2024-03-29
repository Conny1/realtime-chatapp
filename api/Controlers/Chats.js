import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import { createError } from "../utils/err.js";
import User from "../models/User.js";

//@description     Create or fetch One to One Chat
//@route           POST /chats/accesschats
//@access          Protected
export const AccessChats = async (req, resp, next) => {
  //   console.log(req.user);
  const { userid, receiverid, groupid, isgroupchat } = req.body;
  if (!userid) return next(createError(400, "userid not provided"));
  if (isgroupchat) {
    const isChat = await Chat.findById(groupid)
      .populate("users", "-password")
      .populate("latestmessage");

    return resp.status(200).json([isChat]);
  }

  try {
    const isChat = await Chat.find({
      isgroupchat: false,

      $and: [
        { users: { $elemMatch: { $eq: userid } } },
        { users: { $elemMatch: { $eq: receiverid } } },
      ],

      // { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestmessage");
    // console.log(isChat);

    if (isChat.length > 0) {
      return resp.status(200).json(isChat);
    } else {
      var chatData = {
        chatname: "sender",
        isGroupChat: false,
        users: [userid, receiverid],
        // req.user._id, should be in array
      };
      const data = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: data._id }).populate(
        "users",
        "-password"
      );

      resp.status(200).json(FullChat);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//@description      fetch all users chats
//@route           GET /chats/fetchchats/:id
//@access          Protected

export const fetchChats = async (req, resp, next) => {
  const userid = req.params.id;

  try {
    const chats = await Chat.find({ users: { $in: [userid] } })
      .populate("users", "-password")
      .populate("groupadmin", "-password")
      .populate("latestmessage")
      .sort({ updatedAt: -1 });

    if (chats.length === 0) return next(createError(404, "No chats found"));

    return resp.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

//@description      get all users chats
//@route           GET /chats/getallusers
//@access          Protected

export const getAllusers = async (req, resp, next) => {
  const term = req.query.term;
  // console.log(term);

  try {
    const users = await User.find(
      term === ""
        ? {}
        : {
            $or: [
              { name: { $regex: term, $options: "i" } },
              { email: { $regex: term, $options: "i" } },
            ],
          }
    ).select("-password");
    // console.log(users);
    if (users.length === 0) return next(createError(404, "No users found"));

    return resp.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//@description      Create new group
//@route           POST /chats/creategroup/
//@access          Protected

export const creategroup = async (req, resp, next) => {
  try {
    const data = {
      chatname: req.body.chatname,
      isgroupchat: true,
      users: req.body.users,
      groupadmin: req.body.id,
    };

    const group = await Chat.create(data);
    resp.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

//@description      Rename group
//@route           PUT /chats/renamegroup/:id
//@access          Protected

export const renamegroup = async (req, resp, next) => {
  try {
    const Updatedgroup = await Chat.findOneAndUpdate(
      {
        $and: [{ _id: req.params.id }, { isgroupchat: true }],
      },
      { chatname: req.body.chatname },
      { new: true }
    );
    resp.status(200).json(Updatedgroup);
  } catch (error) {
    next(error);
  }
};

//@description      add users to group
//@route           PUT /chats/adduserstogroup/:id
//@access          Protected

export const addgroup = async (req, resp, next) => {
  const objectId = mongoose.Types.ObjectId;
  try {
    const updatedgroup = await Chat.findOneAndUpdate(
      {
        $and: [{ _id: new objectId(req.params.id) }, { isgroupchat: true }],
      },
      {
        $addToSet: {
          users: {
            $each: req.body.users.map((userid) => new objectId(userid)),
          },
        },
      },

      { new: true }
    );
    resp.status(200).json(updatedgroup);
  } catch (error) {
    next(error);
  }
};

//@description      removeuser from group
//@route           PUT /chats/removeuserfromgroup/:id
//@access          Protected

export const removeFromgroup = async (req, resp, next) => {
  const objectId = mongoose.Types.ObjectId;
  try {
    const Updatedgroup = await Chat.findOneAndUpdate(
      {
        $and: [{ _id: new objectId(req.params.id) }, { isgroupchat: true }],
      },
      { $pull: { users: new objectId(req.body.userid) } },
      { new: true }
    );
    resp.status(200).json(Updatedgroup);
  } catch (error) {
    next(error);
  }
};
