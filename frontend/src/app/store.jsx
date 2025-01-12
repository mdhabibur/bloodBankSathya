import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice.jsx";
import storage from "redux-persist/lib/storage"; // Default: localStorage for web
import { persistReducer, persistStore } from "redux-persist";

// Persist configuration for authReducer
const persistConfig = {
  key: "auth",
  storage,
};

// Wrap authReducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use the persisted auth reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Persistor for the store
const persistor = persistStore(store);

export { store, persistor };
