import moment from 'moment';
import mongoose from 'mongoose';

// Create Schema

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // oracle에서 not null과 같은 역할
    index: true, // 검색시 기능을 향상 시킬수 있음
  },
  contents: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: -2, // 처음 작성한 사람도 조회수가 기록이 되기 때문에 그 사람의 조회수를 빼기 위해 -2 설정
  },
  fileUrl: {
    type: String,
    default: 'https://source.unsplash.com/random/301x201', // 기본값의 사진들
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
  date: {
    type: String,
    default: moment().format('MM-DD-YYYY hh:mm:ss'),
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Post = mongoose.model('post', PostSchema);

export default Post;
