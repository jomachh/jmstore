import {
  ADD_PRODUCT,
  CLEAN_CART,
  DELETE_PRODUCT,
} from "../actions/cartActions";

export default function cartReducer(state = { cart: [] }, action) {
  switch (action.type) {
    case ADD_PRODUCT: {
      const { product } = action.payload;

      return { ...state, cart: [...state.cart, product] };
    }
    case CLEAN_CART: {
      return { ...state, cart: [] };
    }
    case DELETE_PRODUCT: {
      const newCart = state.cart.filter(
        (product) => product.id !== action.payload.product.id
      );
      return { ...state, cart: newCart };
    }
    default: {
      return state;
    }
  }
}
