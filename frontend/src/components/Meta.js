import React from 'react';
import { Helmet } from 'react-helmet'; // React Helmet allows us to put HTML 'meta', 'title', and 'link' tags in our React components (this gets generated after the initial page load in JavaScript, so it's not very helpful for SEO unless your React application is being rendered on the server).

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome to ProShop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electronics',
};

export default Meta;
