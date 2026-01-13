
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrUiZ7G7hc7FZcJtk_LEZ9OREMhLvHowY",
  authDomain: "whatsapp-groups-1df5e.firebaseapp.com",
  databaseURL: "https://whatsapp-groups-1df5e-default-rtdb.firebaseio.com",
  projectId: "whatsapp-groups-1df5e",
  storageBucket: "whatsapp-groups-1df5e.firebasestorage.app",
  messagingSenderId: "1084270638482",
  appId: "1:1084270638482:web:a1999cfa4229e5a3177d4b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, onValue, push, update, remove };
