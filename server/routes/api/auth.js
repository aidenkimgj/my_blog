import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';
import config from '../../config/index';
const { JWT_SECRET } = config;

// Model
import User from '../../models/user';

const router = express.Router();
/*
 * @route     POST   api/auth
 * @desc      Auth   user
 * @access    Public
 */
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Simple Validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please fill in all field' });
  }
  // Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: 'This user does not exist' });

    // Validate password
    // password = 현재 유저가 입력한 패스워트 user.password = 위에 email을 통해 찾은 결과값의 패스워드
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({ msg: 'The password does not match' });
      // jwt.sign 함수를 사용하여 token을 생성한다 (token은 로그인을 할때 마다 변한다). 첫번째 인자는 payload, 두번째 인자는 secret, 세번째 인자는 옵션, 마지막은 콜백함수
      jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '2 days' },
        (err, token) => {
          if (err) throw err;
          // res.send()를 사용하는 것 보다  res.json()을 사용하는것이 효율적이다.
          res.json({
            token,
            // 위에 User.findOne({ email }) 이것을 통해 찾은 유저임
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        }
      );
    });
  });
});

router.post('/logout', (req, res) => {
  res.json('You have logged out successfully.');
});

router.get('/user', auth, async (req, res) => {
  try {
    // jwt payload에는 user의 id가 저장되어 있기 때문에 그 id를 가지고 db 조회
    // select에서 password는 빼줌
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('The user does not exist!');
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: e.message });
  }
});

export default router;
