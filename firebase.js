import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import * as SecureStore from "expo-secure-store";

const firebaseConfig = {
  apiKey: "AIzaSyBuDpx_Pk_cwxtPbB_i_NXHFOGQ4Of7nLA",
  authDomain: "memories-654b1.firebaseapp.com",
  projectId: "memories-654b1",
  storageBucket: "memories-654b1.firebasestorage.app",
  messagingSenderId: "1062132350432",
  appId: "1:1062132350432:web:a9146c54205d60c5d4bf85",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(SecureStore),
});
