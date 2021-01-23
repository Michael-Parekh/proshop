import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// Pass in 'isAdmin' as a prop because we want to put this on the admin product list if the user is an admin.
const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((
          x // Map through the number of 'pages' as an array.
        ) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword // The 'to' attribute depends on whether or not there is a 'keyword' (there are 2 public pagination routes in 'App.js' - one with a 'keyword' search and one without).
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}` // If the user is an admin, take them to the corresponding Product List Screen page (instead of rendering the Home Screen).
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
