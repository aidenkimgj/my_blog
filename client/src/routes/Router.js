import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppNavbar from '../components/AppNavbar';
import { Container } from 'reactstrap';
import PostCardList from './normalRoute/PostCardList';
import PostWrite from './normalRoute/PostWrite';
import PostDetail from './normalRoute/PostDetail';
import PostEdit from './normalRoute/PostEdit';
import CategoryResult from './normalRoute/CategoryResult';
import Search from './normalRoute/Search';
import Profile from './normalRoute/Profile';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  EditProtectedRoute,
  ProfileProtectedRoute,
} from './protectedRoute/ProtectedRoute';

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
