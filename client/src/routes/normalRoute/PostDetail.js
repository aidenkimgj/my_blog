import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  POST_DELETE_REQUEST,
  POST_DETAIL_LOADING_REQUEST,
  USER_LOADING_REQUEST,
} from '../../redux/types.js';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useParams } from 'react-router-dom';
import { GrowingSpinner } from '../../components/spinner/Spinner.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPencilAlt,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import { editorConfiguration } from '../../components/editor/CKEditor5Config.js';
import Comments from '../../components/comments/Comments.js';

const PostDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id, 'post detail address');
  const { postDetail, creatorId, title, loading } = useSelector(
    state => state.post
  );
  const { userId, userName } = useSelector(state => state.auth);
  const { comments } = useSelector(state => state.comment);

  useEffect(() => {
    dispatch({
      type: POST_DETAIL_LOADING_REQUEST,
      payload: id,
    });
    dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem('token'),
    });
  }, [dispatch, id]);

  const onDeleteClick = () => {
    dispatch({
      type: POST_DELETE_REQUEST,
      payload: {
        id: id,
        token: localStorage.getItem('token'),
      },
    });
  };

  const OwnerButtons = (
    <>
      <Row className="d-flex justify-content-center pb-3">
        <Col className="col-md-3 mr-md-3">
          <Link to="/" className="btn btn-primary btn-block">
            Home
          </Link>
        </Col>
        <Col className="col-md-3 mr-md-3">
          <Link to={`/post/${id}/edit`} className="btn btn-secondary btn-block">
            Edit Post
          </Link>
        </Col>
        <Col className="col-md-3">
          <Button className="btn-danger btn-block" onClick={onDeleteClick}>
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );

  const GuestButton = (
    <>
      <Row className="d-flex justify-content-center pb-3">
        <Col className="col-sm-12 com-md-3">
          <Link to="/" className="btn btn-primary btn-block">
            Home
          </Link>
        </Col>
      </Row>
    </>
  );

  const Body = (
    <>
      {userId === creatorId ? OwnerButtons : GuestButton}
      <Row className="border-bottom border-top border-muted p-3 mb-3 d-flex justify-content-between">
        {(() => {
          if (postDetail && postDetail.creator) {
            return (
              <>
                <div className="font-weight-bold text-big">
                  <span className="mr-3">
                    <Button className="category_btn" color="info">
                      #{postDetail.category.categoryName}
                    </Button>
                  </span>
                  {postDetail.title}
                </div>
                <div className="align-self-end">
                  <b>{postDetail.creator.name}</b>
                </div>
              </>
            );
          }
        })()}
      </Row>
      {postDetail && postDetail.comments ? (
        <>
          <div className="d-flex justify-content-end align-items-baseline small">
            <FontAwesomeIcon icon={faPencilAlt} />
            &nbsp;
            <span> {postDetail.date}</span>
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faCommentDots} />
            &nbsp;
            <span>{postDetail.comments.length}</span>
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faEye} />
            &nbsp;
            <span>{postDetail.views}</span>
          </div>
          <Row className="mb-3">
            <CKEditor
              editor={BalloonEditor}
              data={postDetail.contents}
              config={editorConfiguration}
              disabled="true"
            />
          </Row>
          <Row>
            <Container className="mb-3 border border-blue rounded">
              <Comments id={id} userId={userId} userName={userName} />
              {Array.isArray(comments)
                ? comments.map(
                    ({ contents, creator, date, _id, creatorName }) => (
                      <div key={_id}>
                        <Row className="justify-content-between p-2">
                          <div className="font-weight-bold">
                            {creatorName ? creatorName : creator}
                          </div>
                          <div className="text-small">
                            <span className="font-weight-bold">
                              {date.split(' ')[0]}
                            </span>
                            <span className="font-weight-light">
                              {' '}
                              {date.split(' ')[1]}
                            </span>
                          </div>
                        </Row>
                        <Row className="p-2">
                          <div>{contents}</div>
                        </Row>
                        <hr />
                      </div>
                    )
                  )
                : 'Creator'}
            </Container>
          </Row>
        </>
      ) : null}
    </>
  );

  return (
    <div>
      <Helmet title={`Post | ${title}`} />
      {loading === true ? GrowingSpinner : Body}
    </div>
  );
};

export default PostDetail;
