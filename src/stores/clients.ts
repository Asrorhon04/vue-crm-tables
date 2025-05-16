// src/stores/clients.ts
import { defineStore } from 'pinia';
import { ref }        from 'vue';
import {
  ref as dbRef,
  get,
  set,
  push,
  update,
  remove,
  DataSnapshot
} from 'firebase/database';
import { db } from 'src/firebase';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([]);
  const loading = ref(false);
  const error   = ref<string | null>(null);

  // Загрузить всех клиентов
  async function loadClients() {
    loading.value = true;
    error.value   = null;

    try {
      const snap: DataSnapshot = await get(dbRef(db, 'clients'));
      const data = snap.val() || {};
      clients.value = Object.entries(data).map(([key, val]: any) => ({
        id:    key,
        name:  val.name,
        email: val.email,
        phone: val.phone
      }));
    }
    catch (e: any) {
      error.value = 'Не удалось загрузить клиентов';
      console.error(e);
    }
    finally {
      loading.value = false;
    }
  }

  // Добавить клиента
  async function addClient(client: Omit<Client, 'id'>) {
    loading.value = true;
    error.value   = null;

    try {
      const newRef = push(dbRef(db, 'clients'));
      await set(newRef, {
        name:  client.name,
        email: client.email,
        phone: client.phone || ''
      });
      // после добавления перезагружаем список
      await loadClients();
    }
    catch (e: any) {
      error.value = 'Не удалось добавить клиента';
      console.error(e);
    }
    finally {
      loading.value = false;
    }
  }

  // Редактировать клиента
  async function updateClient(client: Client) {
    loading.value = true;
    error.value   = null;

    try {
      await update(dbRef(db, `clients/${client.id}`), {
        name:  client.name,
        email: client.email,
        phone: client.phone || ''
      });
      await loadClients();
    }
    catch (e: any) {
      error.value = 'Не удалось обновить клиента';
      console.error(e);
    }
    finally {
      loading.value = false;
    }
  }

  // Удалить клиента
  async function deleteClient(id: string) {
    loading.value = true;
    error.value   = null;

    try {
      await remove(dbRef(db, `clients/${id}`));
      // можно просто отфильтровать без reload:
      clients.value = clients.value.filter(c => c.id !== id);
    }
    catch (e: any) {
      error.value = 'Не удалось удалить клиента';
      console.error(e);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    clients,
    loading,
    error,
    loadClients,
    addClient,
    updateClient,
    deleteClient
  };
});
