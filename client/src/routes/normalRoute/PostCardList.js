import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { POST_LOADING_REQUEST } from '../../redux/types.js';
import { Helmet } from 'react-helmet';
import { Alert, Row } from 'reactstrap';
import { GrowingSpinner } from '../../components/spinner/Spinner.js';
import PostCardOne from '../../components/post/PostCardOne.js';
import Category from '../../components/post/Category.js';

const PostCardList = () => {
  const { posts, categoryFindResult, loading, postCount } = useSelector(
    state => state.post
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: POST_LOADING_REQUEST,
      payload: 0,
    });
  }, [dispatch]);

  // infinity scroll//////////////////////////////////
  // 전 생애주기에서 살아 남을 수 있는것이 useRef이다 useEffect나 useCallback 안에서 변화되는 값들에게 접근을 하기 위해서는 useRef를 사용해야함
  const skipNumberRef = useRef(0);
  const postCountRef = useRef(0);
  const endMsg = useRef(false);

  postCountRef.current = postCount - 6;

  const useOnScreen = options => {
    const lastPostElementRef = useRef();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          let remainPostCount = postCountRef.current - skipNumberRef.current;
          if (remainPostCount >= 0) {
            dispatch({
              type: POST_LOADING_REQUEST,
              payload: skipNumberRef.current + 6,
            });
            skipNumberRef.current += 6;
          } else {
            endMsg.current = true;
            console.log(endMsg.current);
          }
        }
      }, options);
      if (lastPostElementRef.current) {
        observer.observe(lastPostElementRef.current);
      }

      const LastElementReturnFunc = () => {
        if (lastPostElementRef.current) {
          observer.unobserve(lastPostElementRef.current);
        }
      };

      return LastElementReturnFunc;
    }, [lastPostElementRef, options]);

    return [lastPostElementRef, visible];
  };

  const [lastPostElementRef, visible] = useOnScreen({
    threshold: '0.9',
  });
  console.log(visible, 'visible', skipNumberRef.current, 'skipNum');
  ////////////////////////////////infinity scroll/////////////////////////////////////////

  return (
    <>
      <Helmet title="Aiden's Blog" />
      <Row className="border-bottom border-top border-muted py-2 mb-3">
        <Category posts={categoryFindResult} />
      </Row>
      <Row>{posts ? <PostCardOne posts={posts} /> : GrowingSpinner}</Row>
      <div ref={lastPostElementRef}> {loading && GrowingSpinner} </div>
      {loading ? (
        ''
      ) : endMsg ? (
        <div>
          <Alert color="warning" className="text-center font-weight-bolder">
            No more Posts
          </Alert>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default PostCardList;
