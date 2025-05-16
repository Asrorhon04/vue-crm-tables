// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref }           from 'vue';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import { auth as fbAuth } from 'src/firebase';

export const useAuthStore = defineStore('auth', () => {
  const user     = ref<User|null>(null);
  const loading  = ref(false);
  const error    = ref<string|null>(null);

  // Подписываемся на изменения статуса аутентификации
  onAuthStateChanged(fbAuth, u => {
    user.value = u;
  });

  // Логин
  async function login(email: string, password: string) {
    loading.value = true;
    error.value   = null;
    try {
      await signInWithEmailAndPassword(fbAuth, email, password);
    }
    catch (e: any) {
      error.value = e.message || 'Не удалось войти';
    }
    finally {
      loading.value = false;
    }
  }

  // Регистрация
  async function register(email: string, password: string) {
    loading.value = true;
    error.value   = null;
    try {
      await createUserWithEmailAndPassword(fbAuth, email, password);
    }
    catch (e: any) {
      error.value = e.message || 'Не удалось зарегистрировать';
    }
    finally {
      loading.value = false;
    }
  }

  // Выход
  async function logout() {
    await signOut(fbAuth);
    user.value = null;
  }

  return { user, loading, error, login, register, logout };
});
