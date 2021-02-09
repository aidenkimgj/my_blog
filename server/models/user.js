import moment from 'moment';
import mongoose from 'mongoose';

// Create Schema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // oracle에서 not null과 같은 역할
  },
  email: {
    type: String,
    required: true,
    unique: true, // 이메일이 중복 되면 안되니까
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Owner', 'SubOwner', 'User'],
    default: 'User',
  },
  register_date: {
    type: Date,
    default: moment().format('MM-DD-YYYY hh:mm:ss'),
  },
  comments: [
    // 포스트를 지우면 그 밑에 딸린 코멘트도 지우는 것을 구현하기 위해서
    {
      post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
      },
      comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
});
// 해당 스키마를 모듈화 해서 밖으로 내 보내는 과정
const User = mongoose.model('user', UserSchema);

export default User;
