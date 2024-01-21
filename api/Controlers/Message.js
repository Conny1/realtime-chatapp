import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { createError } from "../utils/err.js";

//@description     send Message
//@route           POST /messages/sendmessage
//@access          Protected

export const sendMessage = async (req, resp, next) => {
  const values = {
    chat: req.body.chatid,
    sender: req.body.userid,
    content: req.body.content,
  };

  try {
    const data = await Message.create(values);

    await Chat.findOneAndUpdate(
      {
        _id: data.chat,
      },
      {
        latestmessage: data._id,
      }
    );

    const respdata = await Message.findOne({ _id: data._id })
      .populate("chat")
      .populate("sender");

    // console.log(respdata);

    resp.status(200).json(respdata);
  } catch (error) {
    next(error);
  }
};

//@description     get  Messages
//@route           GET /messages/getmessages
//@access          Protected

export const getallmessages = async (req, resp, next) => {
  const id = req.params.chatid;

  try {
    const data = await Message.find({ chat: id })
      .populate("sender", "-password")
      .populate("chat");

    if (data.length === 0) return next(createError(404, "No chats yet"));

    resp.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
