import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAPszAEylUUMMGG5oOvk4CLR4F0c32ep00",
  authDomain: "oriflame-e5661.firebaseapp.com",
  databaseURL: "https://oriflame-e5661-default-rtdb.firebaseio.com",
  projectId: "oriflame-e5661",
  storageBucket: "oriflame-e5661.appspot.com",
  messagingSenderId: "919458882340",
  appId: "1:919458882340:web:a823dacbff72cba80a89b1",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export {app};
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
