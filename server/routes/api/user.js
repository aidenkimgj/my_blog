import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index';
const { JWT_SECRET } = config;

// Model
import User from '../../models/user';

// 회원 가입 라우터
const router = express.Router();
/*
 * @routes     GET api/user
 * @desc       get all user
 * @access     public
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    if (!users) throw Error('No users');
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    // 만약에 에러가 나오면 400 코드를 보내서 실패 했다고 알려줌 json을 사용하여 메시지를 담아 보낸다.
    res.status(400).json({ msg: e.message });
  }
});
/*
 * @routes     POST api/user
 * @desc       Register user
 * @access     public
 */
router.post('/', (req, res) => {
  console.log(req);
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please fill up all field!!' });
  }

  // Check for exising user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: 'User already exists!!' });
    const newUser = new User({
      name,
      email,
      password,
    });
    // 해쉬값을 만들어 줌 e10 = 1000번을 돌려서 만든다
    // genSalt()는 임의의 값을 만들어주는 역할 메소드 실행할 때 마다 매번 다른값을 만들어 준다.
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        // 새로운 유저의 패스워드는 여기서 만든 해쉬 값이 됨
        newUser.password = hash;
        // 새로운 유저를 저장함
        newUser.save().then(user => {
          // 만들어진 유저를 json web token에 등록함
          jwt.sign(
            // id는 새로만든 뉴 유저의 id가 됨
            { id: user.id },
            // 서버에서 만들어진 웹 토큰을 인증 받기 위해 비밀 값이 필요하다 ( 이 값은 비밀 값이라서 env 파일에 저장한다. )
            JWT_SECRET,
            // 만기일 임 3600초 = 1시간이라는 소리
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                // 만들어진 토큰
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

export default router;
