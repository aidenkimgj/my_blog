import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Button,
  Form,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT_REQUEST } from '../redux/types';
import RegisterModal from './auth/RegisterModal';

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, userRole } = useSelector(state => state.auth);
  console.log(userRole, 'userRole');

  const dispatch = useDispatch();
  // useCallback(callback, [변경되는 값])은 useEffect()와 같은 기능을 하지만 변경되기 전까지의 값을 기억한다
  const onLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, [dispatch]);

  // 유저가 접속을 했을시 구지 창이 열려있을 필요가 없으니까 닫아줌
  useEffect(() => {
    setIsOpen(false);
  }, [user]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const addPostClick = () => {
    // dispatch({
    //   type: POSTS_WRITE_REQUEST,
    // });
  };

  const authLink = (
    <>
      <NavItem>
        {userRole === 'Owner' ? (
          <Form className="col mt-2">
            <Link
              to="/post"
              className="btn btn-success block text-white px-3"
              onClick={addPostClick}
            >
              Add Post
            </Link>
          </Form>
        ) : (
          ''
        )}
      </NavItem>
      {/* 메인유저가 아닌 사람 */}
      <NavItem className="d-flex justify-content-center">
        <Form className="col pr-3 p-1">
          {user && user.name ? (
            <Link
              to={`/user/${user.name}/profile`}
              className="text-decoration-none"
            >
              <Button outline color="light" className="mt-1 mb-1  px-3" block>
                <strong>{user ? `Welcome ${user.name}` : ''}</strong>
              </Button>
            </Link>
          ) : (
            <Button outline color="light" className="mt-1 mb-1 px-3" block>
              <strong>No User</strong>
            </Button>
          )}
        </Form>
      </NavItem>
      <NavItem>
        <Form className="col p-1">
          <Link onClick={onLogout} to="#" className="text-decoration-none">
            <Button outline color="light" className="mt-1 mb-1 px-3 " block>
              <b>Logout</b>
            </Button>
          </Link>
        </Form>
      </NavItem>
    </>
  );

  const guestLink = (
    <>
      <NavItem>
        <RegisterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </>
  );

  return (
    <>
      <Navbar color="dark" dark expand="lg" className="sticky-top">
        <Container>
          <Link to="/" className="text-white text-decoration-none">
            <b className="blog-name">Aiden's Blog</b>
          </Link>
          <NavbarToggler onClick={handleToggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto d-felx justify-content-around" navbar>
              {isAuthenticated ? authLink : guestLink}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;
