import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SEARCH_REQUEST } from '../../redux/types';
import { Row } from 'reactstrap';
import PostCardOne from '../../components/post/PostCardOne';

const Search = () => {
  const dispatch = useDispatch();
  let { searchTerm } = useParams();
  const { searchResult } = useSelector(state => state.post);

  useEffect(() => {
    if (searchTerm) {
      dispatch({
        type: SEARCH_REQUEST,
        payload: searchTerm,
      });
    }
  }, [dispatch, searchTerm]);
  return (
    <div>
      <h1 className="search_head">Search Result: "{searchTerm}"</h1>
      <Row>
        <PostCardOne posts={searchResult} />
      </Row>
    </div>
  );
};

export default Search;
