import User from "../models/User.js";
import { createError } from "../utils/err.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const Register = async (req, resp, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const values = {
    name: req.body.name,
    email: req.body.email,
    password: hash,
  };

  try {
    const data = await User.create(values);
    // console.log(data);
    if (!data) return next(createError(406, "User not added"));

    const tokens = jwt.sign(
      { id: data.id, admin: data.groupadmin },
      process.env.CODE
    );

    const { password, ...others } = data._doc;

    return resp.status(201).json({ ...others, tokens });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, resp, next) => {
  //   console.log(req.body);
  try {
    const data = await User.findOne({ email: req.body.email });

    if (!data)
      return next(createError(404, "User with that account does not exist"));
    const isPassword = bcrypt.compareSync(req.body.password, data.password);
    if (!isPassword)
      return next(createError(401, "invalid username or password"));

    const tokens = jwt.sign(
      { id: data.id, admin: data.groupadmin },
      process.env.CODE
    );

    const { password, ...others } = data._doc;

    return resp.status(201).json({ ...others, tokens });
  } catch (error) {
    next(error);
  }
};
