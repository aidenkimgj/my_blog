import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import AppNavbar from '../components/AppNavbar.js';
import { Container } from 'reactstrap';
import PostCardList from './normalRoute/PostCardList.js';
import PostWrite from './normalRoute/PostWrite.js';
import PostDetail from './normalRoute/PostDetail.js';
import PostEdit from './normalRoute/PostEdit.js';
import CategoryResult from './normalRoute/CategoryResult.js';
import Search from './normalRoute/Search.js';
import Profile from './normalRoute/Profile.js';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  EditProtectedRoute,
  ProfileProtectedRoute,
} from './protectedRoute/ProtectedRoute.js';

const MyRouter = () => {
  return (
    <>
      <AppNavbar />
      <Header />
      <Container id="main-body">
        <Switch>
          <Route path="/" exact component={PostCardList} />
          <Route path="/post" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <EditProtectedRoute
            path="/post/:id/edit"
            exact
            component={PostEdit}
          />
          <Route
            path="/post/category/:categoryName"
            exact
            component={CategoryResult}
          />
          <Route path="/search/:searchTerm" exact component={Search} />
          <ProfileProtectedRoute
            path="/user/:userName/profile"
            exact
            component={Profile}
          />
          <Redirect from="*" to="/" />
        </Switch>
      </Container>
      <Footer />
    </>
  );
};

export default MyRouter;
