import express from 'express';
import auth from '../../middleware/auth';

// Model
import Post from '../../models/post';

const router = express.Router();

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: 'blog/upload',
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

router.post('/', auth, async (req, res, next) => {
  try {
    console.log(req, 'req');
    const { title, contents, fileUrl, creator } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator,
    });
    res.json(newPost);
  } catch (e) {
    console.log(e);
  }
});

export default router;
