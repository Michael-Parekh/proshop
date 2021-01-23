import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword; // Get a potential 'keyword' from the URL because the 'HomeScreen' is rendered whenever a search is made.

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch(); // The 'useDispatch' hook is used to call/dispatch an action.

  const productList = useSelector((state) => state.productList); // The 'useSelector' hook is used to select parts of the state.
  const { loading, error, products, page, pages } = productList;

  // The 'useEffect' hook runs as soon as the component loads (so that you can immediately dispatch an action and get the products).
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber)); // Pass the potential search 'keyword' into the 'listProducts' action to get the products corresponding to the search.
  }, [dispatch, keyword, pageNumber]); // The 'listProducts' action will be dispatched whenever the 'keyword' changes (user makes a new search) or 'pageNumber' changes.

  return (
    <>
      <Meta />
      {!keyword ? ( // Only show the 'ProductCarousel' if it's not a search (in which case there will be no 'keyword'). Otherwise, show a 'Go Back' button if it is a search.
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
