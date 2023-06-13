import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp({
    apiKey: "AIzaSyAinVDbSy6SRh6wGDcJrl2cT85T5eU627c",
    authDomain: "chatterly-b37b5.firebaseapp.com",
    projectId: "chatterly-b37b5",
    storageBucket: "chatterly-b37b5.appspot.com",
    messagingSenderId: "851215913768",
    appId: "1:851215913768:web:4250a6d52ac6839be8761d"
  }).auth();