import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { POST_LOADING_REQUEST } from '../../redux/types';
import { Helmet } from 'react-helmet';
import { Row } from 'reactstrap';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import PostCardOne from '../../components/post/PostCardOne';

const PostCardList = () => {
  const { posts } = useSelector(state => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: POST_LOADING_REQUEST,
    });
  }, [dispatch]);

  return (
    <>
      <Helmet title="Aiden's Blog" />
      <Row>{posts ? <PostCardOne posts={posts} /> : GrowingSpinner}</Row>
    </>
  );
};

export default PostCardList;
