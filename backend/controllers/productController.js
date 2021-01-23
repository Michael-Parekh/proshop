import asyncHandler from 'express-async-handler'; // Middleware for handling exceptions inside of async Express routes (instead of using try-catch blocks).
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10; // 'pageSize' is used for how many products should be displayed on the page (pagination functionality).
  const page = Number(req.query.pageNumber) || 1; // Get the page number that the user is currently on from the URL (will be a query string like '?pageNumber=1'). If that isn't included, then the user is on page 1.

  // If the 'keyword' query exists in the request URL, we want to match the keyword to the name of the product.
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, // We are using 'regex' so that we don't have to search an exact name match.
          $options: 'i', // Case insensitive.
        },
      }
    : {}; // If the 'keyword' query doesn't exist in the request URL, make 'keyword' an empty object so that we get all of the products in the database.

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword }) // 'keyword' is either going to be empty (get all products in the database) or have the keyword in it that matches part/all of the name.
    .limit(pageSize) // Limit the number of products we fetch by the 'pageSize' (and use 'skip()' to only get the products for the page the user is currently on).
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id); // Get a single 'product' from the 'products' array by finding the one with a matching ID (from the URL).

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found.'); // Use our custom error middleware for handling the error.
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found.'); // Use our custom error middleware for handling the error.
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // When users click 'Create Product', a product with sample data will be created in the database (users will then be taken to a page to update that data).
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    ); // Check if the logged in user already submitted a review for the given 'product'.

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    // If the logged in user didn't alreay write a review for the given product, then we should construct a 'review' object.
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review); // Push the new 'review' onto the existing array of 'reviews'.

    product.numReviews = product.reviews.length;

    // Update the total average rating for the given product.
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' }); // Status of '201' because a new resource was created.
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3); // Sort in ascending order and only get 3 products.

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
