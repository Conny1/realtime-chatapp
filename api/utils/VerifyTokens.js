import jwt from "jsonwebtoken";
import { createError } from "./err.js";

export const VerifyTokens = (req, resp, next) => {
  const authTokens = req.headers.authorization;
  if (!authTokens) return next(createError(400, "Token headers not  provided"));

  const token = authTokens.split(" ")[1];

  if (!token) return next(createError(400, "No tokens were provided"));

  jwt.verify(token, process.env.CODE, (err, user) => {
    if (err) return next(createError(401, "Invalid tokens"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, resp, next) => {
  VerifyTokens(req, resp, () => {
    if (req.user.id !== req.params.id) {
      return next(createError(403, "Request is forbidden"));
    }

    next();
  });
};

export const verifgroupAdmin = (req, resp, next) => {
  VerifyTokens(req, resp, () => {
    if (!req.user.isadmin) {
      return next(
        createError(403, "Request requires administartive privilages")
      );
    }

    next();
  });
};
