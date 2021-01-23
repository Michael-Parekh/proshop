import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState(''); // 'keyword' is state that represents the keyword that is passed into the form.

  const submitHandler = (e) => {
    e.preventDefault();
    // If the 'keyword' exists (and trim any whitespace), redirect the user to the corresponding search route. If there is no 'keyword', redirect the user to the homepage.
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5' // Set the left and right margins on small screens.
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
