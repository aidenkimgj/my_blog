import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  COMMENT_UPLOADING_REQUEST,
  COMMENT_LOADING_REQUEST,
} from '../../redux/types.js';
import { Form, FormGroup, Input, Button, Row } from 'reactstrap';

const Comments = ({ id, userName, userId }) => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ contents: '' });

  const onSubmit = async e => {
    await e.preventDefault();
    const { contents } = form;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to write a comment');
      window.location.replace('/');
    }
    const body = {
      contents,
      token,
      id,
      userId,
      userName,
    };

    console.log(body);
    dispatch({
      type: COMMENT_UPLOADING_REQUEST,
      payload: body,
    });
    resetValue.current.value = '';
    setValues('');
  };

  const resetValue = useRef(null);

  const onChange = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(form.contents);
  };

  useEffect(() => {
    dispatch({
      type: COMMENT_LOADING_REQUEST,
      payload: id,
    });
  }, [dispatch, id]);
  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Row className="p-2">
            <div className="font-weight-bold m-1">Add Comment</div>
            <div className="my-1" />
            <Input
              innerRef={resetValue}
              type="textarea"
              name="contents"
              id="contents"
              onChange={onChange}
              placeholder="Write Comment..."
            />
            <Button
              color="warning"
              block
              className="mt-2 offset-md-10 col-md-2 text-white  font-weight-bold"
            >
              Comment
            </Button>
            <hr />
          </Row>
        </FormGroup>
      </Form>
    </>
  );
};

export default Comments;
