import mongoose from 'mongoose';
import moment from 'moment';

const CommentSchema = new mongoose.Schema({
  contents: {
    type: String,
    // not null과 같음 반드시 값이 들어가야 함
    required: true,
  },
  date: {
    type: String,
    default: moment().format('MM-DD-YYYY hh:mm:ss'),
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  // 댓글을 쓸때 작성자 이름도 쓰게 만들어서 데이터 베이스의 부담을 덜어주는 것
  creatorName: { type: String },
});

const Comment = mongoose.model('comment', CommentSchema);

export default Comment;
