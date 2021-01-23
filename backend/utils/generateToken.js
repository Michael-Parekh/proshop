import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // The payload is the user's ID (so that the user's other information can be accessed) and the secret is the 'JWT_SECRET'.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;