import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  NavLink,
} from 'reactstrap';
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from '../../redux/types';

const RegisterModal = () => {
  const [modal, setModal] = useState(false);
  const [form, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [localMsg, setLocalMsg] = useState('');
  const { errorMsg } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch({
      type: CLEAR_ERROR_REQUEST,
    });
    setModal(!modal);
  };

  useEffect(() => {
    try {
      setLocalMsg(errorMsg);
    } catch (e) {
      console.error(e);
    }
  }, [errorMsg]);

  const onChange = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    const { name, email, password } = form;
    const newUser = { name, email, password };
    console.log(newUser, 'newUser');
    dispatch({
      type: REGISTER_REQUEST,
      payload: newUser,
    });
  };

  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        <Button outline color="light" className="px-3" block>
          <strong>Register</strong>
        </Button>
      </NavLink>
      <Modal isOpen={modal} toggle={handleToggle} className="registerModal">
        <ModalHeader toggle={handleToggle}>Register</ModalHeader>
        <ModalBody>
          {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="name"
                name="name"
                id="name"
                placeholder="Please enter your name"
                onChange={onChange}
              />
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Please enter your email"
                onChange={onChange}
              />
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Please enter your password"
                onChange={onChange}
              />
              {/* className을 사용해도 되고 이렇게 해도 된다*/}
              <Button color="dark" style={{ marginTop: '2rem' }} block>
                Register
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default RegisterModal;
