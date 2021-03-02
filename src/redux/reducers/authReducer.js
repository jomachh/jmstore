import { SAVE_USER, LOG_OUT } from "../actions/authActions";

export default function authReducer(state = { user: null }, action) {
  switch (action.type) {
    case SAVE_USER: {
      const { user } = action.payload;

      return { ...state, user };
    }
    case LOG_OUT: {
      return { ...state, user: null };
    }
    default: {
      return state;
    }
  }
}
