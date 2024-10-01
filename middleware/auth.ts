import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = getAuth();
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
  
    console.log('hola middleware')
  })

  