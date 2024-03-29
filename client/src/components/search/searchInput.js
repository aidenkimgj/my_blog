import React, { useState, useRef } from 'react';
import { Form, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { SEARCH_REQUEST } from '../../redux/types.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchInput = () => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ searchBy: '' });

  const onChange = e => {
    console.log(e);
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(form);
  };

  const onSubmit = async e => {
    await e.preventDefault();
    const { searchBy } = form;

    dispatch({
      type: SEARCH_REQUEST,
      payload: searchBy,
    });

    console.log(searchBy, 'Submit Body');
    resetValue.current.value = '';
  };
  const resetValue = useRef(null);

  return (
    <>
      <Form onSubmit={onSubmit} className="col mt-2">
        <div className="search">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <Input
            id="search"
            name="searchBy"
            onChange={onChange}
            innerRef={resetValue}
            placeholder="Search..."
          />
        </div>
      </Form>
    </>
  );
};

export default SearchInput;
