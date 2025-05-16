<template>
  <q-page class="row items-center justify-center">
    <q-card style="width: 350px;">
      <q-card-section class="text-h6">Регистрация</q-card-section>

      <q-card-section>
        <q-input v-model="email" label="Email" type="email" outlined dense />
        <q-input v-model="password" label="Пароль" type="password" outlined dense class="q-mt-sm" />
        <q-input v-model="confirm"  label="Повторите пароль" type="password" outlined dense class="q-mt-sm" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Зарегистрироваться" color="primary" @click="onRegister" :loading="auth.loading" />
      </q-card-actions>

      <q-card-section>
        <q-banner v-if="auth.error" type="negative">{{ auth.error }}</q-banner>
        <div class="text-caption">
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useRouter }    from 'vue-router';

const auth   = useAuthStore();
const router = useRouter();

const email    = ref('');
const password = ref('');
const confirm  = ref('');

// После регистрации уходим на home
watch(() => auth.user, u => {
  if (u) {
    router.replace({ name: 'home' });
  }
});

async function onRegister() {
  if (password.value !== confirm.value) {
    auth.error = 'Пароли не совпадают';
    return;
  }
  await auth.register(email.value, password.value);
}
</script>
