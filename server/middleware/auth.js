import jwt from 'jsonwebtoken';
import config from '../config/index';
const { JWT_SECRET } = config;

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .staus(401)
      .json({ msg: 'Authentication refused because there was no token!!' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // go to next
    next();
  } catch (e) {
    console.log(e);
    res.staus(400).json({ msg: 'The token value is not valid!' });
  }
};

export default auth;
