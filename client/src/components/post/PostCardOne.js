import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Row,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const PostCardOne = ({ posts }) => {
  console.log(posts, '카드원으로 넘어온 값');
  return (
    <>
      {Array.isArray(posts)
        ? posts.map(({ _id, title, fileUrl, comments, views }) => {
            return (
              <div key={_id} className="col-md-4">
                <Link
                  to={`/post/${_id}`}
                  className="text-dark text-decoration-none"
                >
                  <Card className="mb-3">
                    <CardImg top alt="card img" src={fileUrl} />
                    <CardBody>
                      <CardTitle className="text-truncate d-flex justify-content-between">
                        {/* text-truncate는 제목이 길면 짧게 표시해주는 것 */}
                        <span className="text-truncate">
                          <b>{title}</b>
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faEye} />
                          &nbsp; {/*줄 바꿈 없는 공백을 의미함 */}
                          <span>{views}</span>
                        </span>
                      </CardTitle>
                      <Row>
                        <Button color="primary" className="p-2 btn-block">
                          More <Badge color="light">{comments.length}</Badge>
                        </Button>
                      </Row>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })
        : null}
    </>
  );
};

export default PostCardOne;
