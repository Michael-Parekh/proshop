import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// This custom middleware will validate the user's token.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Only get the actual token from the headers (don't get the 'Bearer' part of the token).

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password'); // Put the user's data in 'req.user', which we now have access to in all of the protected routes (minus the password).

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// This custom middleware will check whether or not the user is an admin.
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // If the user is logged in and an admin, call 'next()' to move on (otherwise the user is unauthorized).
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
