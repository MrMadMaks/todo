
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBx9_5VfWgh8vEWj9MH8sY-uwenQnBaiDk",
    authDomain: "todo-ecbdd.firebaseapp.com",
    projectId: "todo-ecbdd",
    storageBucket: "todo-ecbdd.appspot.com",
    messagingSenderId: "514073698652",
    appId: "1:514073698652:web:77f9a0c356dba19753e199"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);