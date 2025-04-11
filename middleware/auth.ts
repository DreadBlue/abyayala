import { auth } from "../firebase/firebase.config.js";
import { onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });

      if (user) {
      console.log('usuario loggeado');
      } else {
        console.log('no loggeado');
        return navigateTo('/admin', { redirectCode: 301 });
      }
  
  })

  