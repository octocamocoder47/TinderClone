import { configureStore } from "@reduxjs/toolkit";
// import { addUser, removeUser } from "./userSlice";
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default appStore;
