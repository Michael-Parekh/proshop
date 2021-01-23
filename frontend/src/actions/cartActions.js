import axios from 'axios'; // When an item is added to the cart, we want to make a request to '/api/products/:id' to get the data for that particular product.
import { 
  CART_ADD_ITEM, 
  CART_REMOVE_ITEM, 
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => { // 'getState' allows us to get the entire state tree (e.g. 'productList', 'productDetails', and 'cart').
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    // Add all of the information that should be displayed on the 'Cart' page in the 'payload'.
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty
    }
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems)); // Save the 'cartItems' state in local storage.
};

export const removeFromCart = (id) => (dispatch, getState) => { // 'getState' is used to get all of the cart items (and reset the local storage to whatever is in the cart minus what was removed).
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const saveShippingAddress = (data) => (dispatch) => {  
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data, // 'data' is the shipping address form data that is passed in.
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => (dispatch) => {  
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data, // 'data' is the payment method that is passed in.
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
}