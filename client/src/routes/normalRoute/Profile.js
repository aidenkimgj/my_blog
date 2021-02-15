import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  CLEAR_ERROR_REQUEST,
  PASSWORD_EDIT_UPLOADING_REQUEST,
} from '../../redux/types';
import Helmet from 'react-helmet';
import {
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Button,
} from 'reactstrap';

const Profile = () => {
  const { userId, errorMsg, successMsg, previousMatchMsg } = useSelector(
    state => state.auth
  );
  console.log(successMsg);
  const { userName } = useParams();
  const [form, setValues] = useState({
    previousPassword: '',
    password: '',
    rePassword: '',
  });
  const dispatch = useDispatch();
  const onChange = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async e => {
    await e.preventDefault();
    const { previousPassword, password, rePassword } = form;
    const token = localStorage.getItem('token');

    const body = {
      password,
      token,
      previousPassword,
      rePassword,
      userId,
      userName,
    };

    dispatch({
      type: CLEAR_ERROR_REQUEST,
    });
    dispatch({
      type: PASSWORD_EDIT_UPLOADING_REQUEST,
      payload: body,
    });
  };

  useEffect(() => {
    dispatch({
      type: CLEAR_ERROR_REQUEST,
    });
  }, []);

  return (
    <>
      <Helmet title={`Profile | ${userName}'s Profile`} />
      <Col sm="12" md={{ size: 6, offset: 3 }} className="profile">
        <Card>
          <CardHeader id="card-header">
            <strong>Edit Password</strong>
          </CardHeader>
          <CardBody>
            <Form onSubmit={onSubmit}>
              {successMsg ? <Alert color="success">{successMsg}</Alert> : ''}
              {errorMsg ? <Alert color="danger">{errorMsg}</Alert> : ''}
              {previousMatchMsg ? (
                <Alert color="danger">{previousMatchMsg}</Alert>
              ) : (
                ''
              )}
              <FormGroup>
                <Label for="title">Previous Password</Label>
                <Input
                  type="password"
                  name="previousPassword"
                  id="previousPassword"
                  className="form-control mb-2"
                  onChange={onChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="title">New Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  onChange={onChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="title">Confirm Password</Label>
                <Input
                  type="password"
                  name="rePassword"
                  id="rePassword"
                  className="form-control mb-2"
                  onChange={onChange}
                />
              </FormGroup>
              <Button color="success" block className="mt-4 mb-4">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Profile;
