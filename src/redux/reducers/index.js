import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import authReducer from "./authReducer";

export default combineReducers({ cartReducer, authReducer });
