import express from 'express';
const router = express.Router();

import Post from '../../models/post.js';

/*
 * @route    GET api/search/:searchTerm
 * @desc     search name get
 * @access   Public
 *
 */
router.get('/:searchTerm', async (req, res, next) => {
  console.log(req.params.searchTerm, '이게 뭔가요?');
  try {
    const result = await Post.find({
      title: {
        $regex: req.params.searchTerm,
        $options: 'i',
      },
    });
    console.log(result, 'Search result');
    res.json(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
