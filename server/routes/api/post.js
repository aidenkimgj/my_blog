import express from 'express';
import auth from '../../middleware/auth';
import moment from 'moment';

// Model
import Post from '../../models/post';
import Category from '../../models/category';
import User from '../../models/user';

const router = express.Router();

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { isNullOrUndefined } from 'util';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: 'blogaiden/upload',
    region: 'us-west-1',
    // 중복되는 파일의 이름을 구분하기 위해서
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  // 파일 사이즈 100mb
  limits: { fileSize: 100 * 1024 * 1024 },
});

/*
 * @route     POST   api/post/image
 * @desc      Create a post
 * @access    Private
 */

// 경로를 upload로 보내는데 사진을 여러개 보낼 수 있고 5개까지 제한하겠다는 말임 (array 부분이 single이 되면 이미지 파일 한개만 받겠다는 뜻)
router.post('/image', uploadS3.array('upload', 5), async (req, res, next) => {
  try {
    console.log(req.files.map(v => v.location));
    res.json({ uploaded: true, url: req.files.map(v => v.location) });
  } catch (e) {
    console.error(e);
    res.json({ uploaded: false, url: null });
  }
});

// api/post
router.get('/', async (req, res) => {
  const postFindResult = await Post.find();

  console.log(postFindResult, 'All Post Get');
  res.json(postFindResult);
});

/*
 * @route     POST   api/post/
 * @desc      Create a post
 * @access    Private
 */
router.post('/', auth, uploadS3.none(), async (req, res, next) => {
  try {
    console.log(req, 'req');
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator: req.user.id,
      date: moment().format('MM-DD-YYYY hh:mm:ss'),
    });

    // find category from database
    const existedCategory = await Category.findOne({
      categoryName: category,
    });

    console.log(existedCategory, 'Find Result category');
    // the category does not exist in the database.
    if (isNullOrUndefined(existedCategory)) {
      // create new category
      const newCategory = await Category.create({
        categoryName: category,
      });
      // insert data into database
      await Post.findByIdAndUpdate(newPost._id, {
        // $push는 기존 배열에 값을 추가해서 넣을때를 의미
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: { posts: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { posts: newPost._id },
      });

      // the category exist in the database
    } else {
      await Post.findByIdAndUpdate(newPost._id, {
        // 포스트 모델 입장에서는 특정 포스트 모델에서 카테고리를 찾았으니 이를 업데이트만 해주면  $push가 사용되지 않은 것이다
        category: existedCategory._id,
      });
      await Category.findByIdAndUpdate(existedCategory._id, {
        $push: { posts: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { posts: newPost._id },
      });
    }
    return res.redirect(`/api/post/${newPost._id}`);
  } catch (e) {
    console.log(e);
  }
});

/*
 * @route     GET   api/post/:id
 * @desc      Detail post
 * @access    Public
 *
 */

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('creator', 'name')
      .populate({ path: 'category', select: 'categoryName' })
      .exec();
    post.views += 1;
    post.save();
    console.log(post);
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
