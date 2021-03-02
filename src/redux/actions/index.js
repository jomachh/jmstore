import { ADD_PRODUCT, CLEAN_CART, DELETE_PRODUCT } from "./cartActions";
import { SAVE_USER, LOG_OUT } from "./authActions";

export const add_product = (product) => ({
  type: ADD_PRODUCT,
  payload: {
    product,
  },
});

export const clean_cart = () => ({
  type: CLEAN_CART,
  payload: {},
});

export const delete_product = (product) => ({
  type: DELETE_PRODUCT,
  payload: {
    product,
  },
});

export const save_user = (user) => ({
  type: SAVE_USER,
  payload: {
    user,
  },
});

export const log_out = () => ({
  type: LOG_OUT,
  payload: {},
});
