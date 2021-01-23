import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // Individual rating from each user of the product.
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    // Associate the 'user' with the 'reviewSchema' so that we can check if the 'user' already posted a review.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Create a relationship between the 'Product' model and the 'User' model.
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    // The 'user' field is added to know which admin created each product.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Create a relationship between the 'Product' model and the 'User' model.
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema], // 'reviews' is an array of review objects (since 'reviewSchema' is small and this is all its being used for, it can be kept in this file).
    // Average rating of the product.
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Mongoose will automatically create the 'Updated at' and 'Created at' time fields.
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
