import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBhQ5AignyTFF4X_R4eRkO9eLcRjWRzNSc",
    authDomain: "my-firebase-app-37a50.firebaseapp.com",
    projectId: "my-firebase-app-37a50",
    storageBucket: "my-firebase-app-37a50.appspot.com",
    messagingSenderId: "410164818155",
    appId: "1:410164818155:web:f734cc36c78486f6ea8eae",
    measurementId: "G-LH7GNZ55GS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sign Up
if (document.querySelector("#sbtn")) {
    document.querySelector("#sbtn").addEventListener("click", function (e) {
        e.preventDefault();
        let name = document.querySelector("#signupName").value.trim();
        let email = document.querySelector("#signupEmail").value.trim();
        let password = document.querySelector("#signupPassword").value.trim();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                Swal.fire("Success", "Signup successful!", "success").then(() => {
                    window.location.href = "login/login.html";
                });
            })
            .catch((error) => {
                Swal.fire("Error", error.message, "error");
            });
    });
}

// Sign In
if (document.querySelector("#lbtn")) {
    document.querySelector("#lbtn").addEventListener("click", function (e) {
        e.preventDefault();
        let email = document.querySelector("#loginEmail").value.trim();
        let password = document.querySelector("#loginPassword").value.trim();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                Swal.fire("Success", "Login successful!", "success").then(() => {
                    window.location.href = "dashboard/dashboard.html";
                });
            })
            .catch((error) => {
                Swal.fire("Error", error.message, "error");
            });
    });
}

try {
    const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
} catch (e) {
    console.error("Error adding document: ", e);
}

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
});


export { db, auth };