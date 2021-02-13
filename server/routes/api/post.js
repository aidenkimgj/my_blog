import express from 'express';
import auth from '../../middleware/auth.js';
import moment from 'moment';

// Model
import Post from '../../models/post.js';
import Category from '../../models/category.js';
import User from '../../models/user.js';
import Comment from '../../models/comment.js';

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

// api/post

/*
 * @route     POST   api/post/image
 * @desc      upload image
 * @access    Private
 *
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

/*
 * @route     GET   api/post/
 * @desc      get all post
 * @access    Public
 *
 */

router.get('/', async (req, res) => {
  const postFindResult = await Post.find();
  const categoryFindResult = await Category.find();
  const result = { postFindResult, categoryFindResult };
  console.log(result, 'All Post Get');
  res.json(result);
});

/*
 * @route     POST   api/post/
 * @desc      Create a post
 * @access    Private
 *
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
    console.error(e);
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
      .populate('creator', 'name') // 앞에가 path고 뒤에가 select 임
      .populate({ path: 'category', select: 'categoryName' });
    // .exec();
    post.views += 1;
    post.save();
    console.log(post);
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// Comments route
/*
 * @route     GET   api/post/:id/comments
 * @desc      Get All Comments
 * @access    Public
 *
 */
router.get('/:id/comments', async (req, res) => {
  console.log(req.params.id, 'ID');

  try {
    const comment = await Post.findById(req.params.id).populate('comments');

    console.log(comment, 'comment load');
    res.json(comment);
  } catch (e) {
    console.error(e);
  }
});

/*
 * @route     POST   api/post/:id/comments
 * @desc      Create a post
 * @access    Private
 *
 */
router.post('/:id/comments', async (req, res, next) => {
  console.log(req, 'comments');
  const newComment = await Comment.create({
    contents: req.body.contents,
    creator: req.body.userId,
    creatorName: req.body.userName,
    post: req.body.id,
    date: moment().format('MM-DD-YYYY hh:mm:ss'),
  });
  console.log(newComment, 'newComment');

  try {
    await Post.findByIdAndUpdate(req.body.id, {
      $push: {
        comments: newComment._id,
      },
    });
    // 어떤 사람을 찾아서 그 사람이 어떤 포스트에 어떤 코멘트를 썼는지 업데이트 해준다
    await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        comments: {
          post_id: req.body.id,
          comment_id: newComment._id,
        },
      },
    });
    res.json(newComment);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// Delete route
/*
 * @route    Delete api/post/:id
 * @desc     Delete a Post
 * @access   Private
 *
 */
router.delete('/:id', auth, async (req, res) => {
  await Post.deleteMany({ _id: req.params.id });
  await Comment.deleteMany({ post: req.params.id });
  await User.findByIdAndUpdate(req.user.id, {
    // 몽고db에서 배열에서 값을 빼낼때 pull을 쓴다
    $pull: {
      posts: req.params.id,
      comments: { post_id: req.params.id },
    },
  });
  const CategoryUpdateResult = await Category.findOneAndUpdate(
    { posts: req.params.id },
    { $pull: { posts: req.params.id } },
    { new: true }
  );

  if (CategoryUpdateResult.posts.length === 0) {
    await Category.deleteMany({ _id: CategoryUpdateResult });
  }
  return res.json({ success: true });
});

// Edit route
/*
 * @route    GET api/post/:id/edit
 * @desc     Get post that need to be edited
 * @access   Private
 *
 */
router.get('/:id/edit', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('creator', 'name');
    res.json(post);
  } catch (e) {
    console.error(e);
  }
});

/*
 * @route    POST api/post/:id/edit
 * @desc     Edit Post
 * @access   Private
 *
 */
router.post('/:id/edit', auth, async (req, res, next) => {
  console.log(req, 'api/post/:id/edit');
  // 구조분해 문법을 쓰는것이 조금 더 깔끔해 진다.
  const {
    body: { title, contents, fileUrl, id },
  } = req;

  try {
    const modified_post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        contents,
        fileUrl,
        date: moment().format('MM-DD-YYYY hh:mm:ss'),
      },
      { new: true }
    );
    console.log(modified_post, 'edit modified');
    res.redirect(`/api/post/${modified_post.id}`);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

/*
 * @route    GET api/post/category/:categoryName
 * @desc     category get
 * @access   Public
 *
 */
router.get('/category/:categoryName', async (req, res, next) => {
  try {
    const result = await Category.findOne(
      {
        categoryName: {
          // 이것은 정규식 표현법이다 카테고리 이름을 가지고 있는 것을 대문자 소문자 구분 없이 찾는다는 것
          $regex: req.params.categoryName,
          $options: 'i',
        },
      },
      // 위에 작성한 필터를 바탕으로 posts 에서 찾으라는 의미
      'posts'
    ).populate({ path: 'posts' });
    console.log(result, 'Category Find result');
    res.json(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
