<template>
  <q-layout view="lHh Lpr lFf" :class="$q.dark.isActive ? 'theme--dark' : ''">
    <!-- Header скрываем на /login и /register -->
    <q-header v-if="!isAuthPage" elevated class="shadow-card">
      <q-toolbar>
        <q-btn
          flat dense round icon="menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>CRM System</q-toolbar-title>
        <q-space />
        <!-- Переключатель темы -->
        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="$q.dark.toggle()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="!isAuthPage" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>
        <q-item-label header>Меню</q-item-label>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section>Клиенты</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Выйти</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const isAuthPage = computed(() =>
  route.name === 'login' || route.name === 'register'
);

// если залогинен и вручную попал на /login или /register — уводим на home
watch(
  () => isAuthPage.value,
  onAuthPage => {
    if (onAuthPage && auth.user) {
      router.replace({ name: 'home' });
    }
  },
  { immediate: true }
);

function logout() {
  auth.logout();
  router.replace({ name: 'login' });
}
</script>

<style lang="scss" scoped>
.shadow-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  z-index: 1;
}
</style>
