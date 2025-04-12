import { auth } from "../firebase/firebase.config.js";
import { onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });

  if (user) {
    return navigateTo("/admin/reservas", { redirectCode: 301 });
  }
});
