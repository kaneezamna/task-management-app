



  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword,signOut,signInWithPopup,GoogleAuthProvider,
    onAuthStateChanged,} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCao0M5UnMVJ-lzfYWpb6XgeLaiXFknHjk",
    authDomain: "my-project-e4d56.firebaseapp.com",
    projectId: "my-project-e4d56",
    storageBucket: "my-project-e4d56.firebasestorage.app",
    messagingSenderId: "157238341955",
    appId: "1:157238341955:web:77d44f2086312b3902bff6",
    measurementId: "G-R2XRX3MWP6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();




//signup

 document.getElementById("signup-btn")?.addEventListener("click", (e) => {
 e.preventDefault();
 const email = document.getElementById("signup-email").value;
 const password = document.getElementById("signup-password").value;
 createUserWithEmailAndPassword(auth, email, password)
  .then(() => {
         alert("Sign Up Successful!");
         window.location.href = "./task/index1.html";
})
    .catch((error) => {
            alert(error.message);
});

 });

 //login

 document.getElementById("login-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
 const email = document.getElementById("login-email").value;
 const password = document.getElementById("login-password").value;
 signInWithEmailAndPassword(auth, email, password)
.then(() => {
   alert("Login Successful!");
   window.location.href = "./task/index1.html";
 })
.catch((error) => {
    alert(error.message);
});
});

//google auth

document.getElementById("google-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
.then(() => {
    alert("Login Successful!");
    window.location.href = "./task/index1.html";
})
.catch((error) => {
    alert(error.message);
});
});

// Logout

document.getElementById("logout-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
  signOut(auth)
.then(() => {
    alert("Logged Out Successfully!");
    window.location.href = "index.html";
 })
.catch((error) => {
    alert(error.message);
});
});

//Show User Email on Welcome Page

onAuthStateChanged(auth, (user) => {
if (user && window.location.pathname.includes("./task/index1.html")){
document.getElementById("user-email").textContent = user.email;
} 
else if (!user && window.location.pathname.includes("./task/index1.html")) {
window.location.href = "index.html";
}
});



  
  
  // Rest of your existing task management code...
  // [Your existing task management JavaScript goes here]
