# Smart CRM Tables

Профессиональная CRM-система для управления справочниками и таблицами данных. Построена с использованием Vue 3, Quasar, TypeScript и Pinia. Проект реализует интерфейс с таблицами, формами, фильтрами и модальными окнами для создания и редактирования сущностей.

## 🚀 Функциональность

- 📋 Таблицы с постраничной навигацией (`QTable`)
- 🔍 Фильтрация и сортировка данных
- ➕ Добавление и редактирование записей (в диалогах)
- ❌ Подтверждение удаления с модальным окном
- 📦 Работа с мок-данными (возможно подключение API)
- 🛠 Уведомления об успехе/ошибке (`useNotify`)
- 🌐 Поддержка мультиязычности (i18n: RU / EN)
- 🌙 Светлая и тёмная темы (Quasar themes)
- 📱 Адаптивность для мобильных устройств

## 🛠️ Используемые технологии

- [Vue 3](https://vuejs.org/) + Composition API + `<script setup>`
- [Quasar Framework](https://quasar.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/) — управление состоянием
- [Vue I18n](https://kazupon.github.io/vue-i18n/) — мультиязычность
- `Axios` или моковые данные в Store
- ESLint + Prettier — для чистоты кода

## 📦 Установка и запуск

```bash
git clone https://github.com/Asrorhon04/vue-crm-tables.git
cd vue-crm-tables
npm install
quasar dev

📁 Структура проекта
src/
├── components/        # Переиспользуемые компоненты
├── composables/       # useDialog, useNotify и др.
├── pages/             # Pages: ClientsPage.vue, StatusPage.vue и т.д.
├── store/             # Pinia stores
├── router/            # Роутинг приложения
├── i18n/              # Файлы локализации
└── assets/            # Иконки, стили и прочее

🧑‍💻 Автор
Telegram: @Asrorkhon04

GitHub: github.com/Asrorhon04
