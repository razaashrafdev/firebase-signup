import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

const modal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const productForm = document.getElementById("productForm");

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const editingIndex = document.getElementById("editingIndex");
const productList = document.getElementById("productList");

addProductBtn.addEventListener("click", () => {
  editingIndex.value = "";
  productForm.reset();
  modal.classList.add("show");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productData = {
    image: productImage.value,
    name: productName.value,
    price: parseFloat(productPrice.value)
  };

  try {
    if (editingIndex.value) {
      const productRef = doc(db, "products", editingIndex.value);
      await updateDoc(productRef, productData);
      Swal.fire("Updated!", "Product updated successfully", "success");
    } else {
      await addDoc(collection(db, "products"), productData);
      Swal.fire("Added!", "Product added successfully", "success");
    }

    modal.classList.remove("show");
    loadProducts();
  } catch (error) {
    console.error("Error saving product:", error);
    Swal.fire("Error", "Something went wrong", "error");
  }
});

async function loadProducts() {
  productList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
            <img src="${data.image}" alt="${data.name}">
            <h3>${data.name}</h3>
            <p>Rs. ${data.price}</p>
            <div class="actions">
                <button class="edit-btn" data-id="${docSnap.id}">Edit</button>
                <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
            </div>
        `;

    productList.appendChild(productCard);
  });

  attachProductEvents();
}

function attachProductEvents() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const productRef = doc(db, "products", id);
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((docSnap) => {
        if (docSnap.id === id) {
          const data = docSnap.data();
          productImage.value = data.image;
          productName.value = data.name;
          productPrice.value = data.price;
          editingIndex.value = id;
          modal.classList.add("show");
        }
      });
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "products", id));
      Swal.fire("Deleted!", "Product deleted successfully", "success");
      loadProducts();
    });
  });
}

loadProducts();
