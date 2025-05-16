<template>
  <q-page class="q-pa-md">
    <!-- Сама карточка с таблицей -->
    <q-card class="shadow-card q-ma-md bg-white">
      <!-- Заголовок и поиск -->
      <q-card-section class="row items-center q-px-md q-py-sm">
        <div class="text-h5 text-primary">Список клиентов</div>
        <q-space />
        <q-input
          outlined
          dense
          debounce="300"
          v-model="search"
          placeholder="Поиск по имени, email или телефону..."
          class="q-ml-md"
          clearable
          style="max-width: 300px"
        />
      </q-card-section>

      <!-- Кнопка добавить -->
      <q-card-section class="q-px-md q-pt-none q-pb-sm">
        <q-btn
          label="Добавить клиента"
          color="primary"
          icon="add"
          rounded
          @click="openAddDialog"
        />
      </q-card-section>

      <q-separator />

      <!-- Диалог добавления/редактирования -->
      <q-dialog v-model="showDialog" @hide="clearForm">
        <q-card class="shadow-card" style="min-width: 400px;">
          <q-card-section class="text-h6">
            {{ isEdit ? 'Редактировать клиента' : 'Добавить клиента' }}
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="form.name"
              label="Имя"
              outlined
              dense
              class="q-mb-sm"
            />
            <q-input
              v-model="form.email"
              label="Email"
              outlined
              dense
              class="q-mb-sm"
            />
            <q-input
              v-model="form.phone"
              label="Телефон"
              outlined
              dense
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn
              flat
              label="Сохранить"
              color="primary"
              @click="saveForm"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Ошибка или пустой список -->
      <q-banner
        v-if="error"
        type="negative"
        dense
        elevated
        class="q-mb-sm"
      >{{ error }}</q-banner>

      <div
        v-else-if="!loading && !error && clients.length === 0"
        class="text-center text-grey q-pa-md"
      >
        Клиентов пока нет. Нажмите «Добавить клиента».
      </div>

      <!-- Таблица клиентов -->
      <q-table
        :rows="paginatedClients"
        :columns="columns"
        row-key="id"
        flat
        bordered
        row-hover
        dense
        :loading="loading"
        hide-bottom
        class="shadow-card q-mx-md q-mb-md"
      >
        <template v-slot:loading>
          <q-inner-loading showing>
            <q-skeleton type="rect" class="full-width" />
          </q-inner-loading>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td align="right">
            <q-btn
              icon="edit"
              flat
              dense
              color="primary"
              @click="openEditDialog(props.row)"
            />
            <q-btn
              icon="delete"
              flat
              dense
              color="negative"
              @click="confirmDeleteClient(props.row)"
              class="q-ml-sm"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Пагинация -->
      <div class="row items-center q-pa-sm">
        <q-select
          v-model="rowsPerPage"
          :options="[5, 10, 20, 50]"
          label="Строк на странице"
          outlined
          dense
          style="width: 150px"
          class="rows-per-page"
        />
        <q-space />
        <q-pagination
          v-model="page"
          :max="pagesCount"
          max-pages="7"
          boundary-numbers
          dense
          rounded
          spacing="sm"
          control-color="grey-4"
          text-color="grey-9"
          color="secondary"          
          active-color="accent"
          active-text-color="white"
          class="my-pagination q-ma-md"
        />
      </div>

      <!-- Диалог удаления -->
      <q-dialog v-model="showDeleteDialog">
        <q-card class="shadow-card" style="min-width: 350px;">
          <q-card-section class="text-h6">Подтверждение удаления</q-card-section>
          <q-card-section>
            Вы уверены, что хотите удалить клиента
            <b>{{ clientToDelete?.name }}</b>?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn flat label="Удалить" color="negative" @click="deleteClient" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useClientsStore, type Client } from 'stores/clients';
import { useAuthStore } from 'stores/auth';
import { useQuasar, type QTableColumn } from 'quasar';

const $q = useQuasar();
const store = useClientsStore();
const auth = useAuthStore();

// Состояния
const search = ref('');
const showDialog = ref(false);
const isEdit = ref(false);
const form = reactive<Partial<Client>>({ name: '', email: '', phone: '' });
const showDeleteDialog = ref(false);
const clientToDelete = ref<Client|null>(null);

// Данные из стора
const clients = computed(() => store.clients);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// Пагинация
const page = ref(1);
const rowsPerPage = ref(10);
watch(search, () => { page.value = 1; });

// Фильтрация и пагинация
const filteredClients = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q
    ? clients.value.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone||'').toLowerCase().includes(q)
      )
    : clients.value;
});
const paginatedClients = computed(() => {
  const start = (page.value - 1) * rowsPerPage.value;
  return filteredClients.value.slice(start, start + rowsPerPage.value);
});
const pagesCount = computed(() =>
  Math.ceil(filteredClients.value.length / rowsPerPage.value)
);

// Столбцы
const columns = reactive<QTableColumn[]>([
  { name:'name',  label:'Имя',     field:'name',   align:'left' },
  { name:'email', label:'Email',   field:'email',  align:'left' },
  { name:'phone', label:'Телефон', field:'phone',  align:'left' },
  { name:'actions',label:'Действия',field:'actions',align:'right' }
]);

// Показываем уведомления об ошибке
watch(error, msg => {
  if (msg) $q.notify({ type:'negative', message:msg });
});

// Открыть диалог добавления
function openAddDialog() {
  isEdit.value = false;
  form.name = '';
  form.email = '';
  form.phone = '';
  showDialog.value = true;
}

// Открыть диалог редактирования
function openEditDialog(c: Client) {
  isEdit.value = true;
  form.id    = c.id;
  form.name  = c.name;
  form.email = c.email;
  form.phone = c.phone ?? '';
  showDialog.value = true;
}

// Валидация
function validateForm(data: Partial<Client>): boolean {
  if (!data.name?.trim()) {
    $q.notify({ type:'negative', message:'Имя обязательно' });
    return false;
  }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRx.test(data.email)) {
    $q.notify({ type:'negative', message:'Введите корректный Email' });
    return false;
  }
  if (data.phone && data.phone.trim().length < 5) {
    $q.notify({ type:'negative', message:'Телефон не короче 5 символов' });
    return false;
  }
  return true;
}

// Сохранение
async function saveForm() {
  if (!validateForm(form)) return;
  if (isEdit.value && form.id) {
    await store.updateClient(form as Client);
  }
  else {
    await store.addClient(form as Omit<Client,'id'>);
  }
  showDialog.value = false;
}

// Сброс формы при закрытии
function clearForm() {
  form.name = '';
  form.email = '';
  form.phone = '';
}

// Подтверждение удаления
function confirmDeleteClient(c: Client) {
  clientToDelete.value = c;
  showDeleteDialog.value = true;
}

// Удалить
async function deleteClient() {
  if (clientToDelete.value) {
    await store.deleteClient(clientToDelete.value.id);
  }
  showDeleteDialog.value = false;
  clientToDelete.value = null;
}

// При монтировании всегда подгружаем
onMounted(() => {
  store.loadClients();
});
</script>

<style lang="scss" scoped>
.shadow-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 8px;
}
</style>
