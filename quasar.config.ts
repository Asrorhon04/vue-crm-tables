import { defineConfig } from '#q-app/wrappers';
import { fileURLToPath } from 'node:url';

export default defineConfig((ctx) => {
  return {
    boot: [
      'i18n',
      'axios',
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],
    build: {
      target: {
        browser: [ 'es2022', 'firefox115', 'chrome115', 'safari14' ],
        node: 'node20'
      },

      typescript: {
        strict: true,
        vueShim: true
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      
      vitePlugins: [
        ['@intlify/unplugin-vue-i18n/vite', {
          ssr: ctx.modeName === 'ssr',
          include: [ fileURLToPath(new URL('./src/i18n', import.meta.url)) ]
        }]
      ]
    },

    devServer: {
      // https: true,
      open: true // opens browser window automatically
    },

    framework: {
      config: {
        brand: {
          primary:   '#FC4445', // синий
          secondary: '#3FEEE6', // аква
          accent:    '#55BCC9', // оранжевый
          positive:  '#21BA45',
          negative:  '#C10015',
          info:      '#97CAEF',
          warning:   '#F2C037',
          dark:      '#1D1D1D',
          light:     '#CAFAFE'
        }
      },
      plugins: [
        'Notify'
      ]
    },

    animations: [],

    ssr: {
      prodPort: 3000, // The default port that the production server should use

      middlewares: [
        'render' // keep this as last one
      ],


      pwa: false
    },

    pwa: {
      workboxMode: 'GenerateSW' // 'GenerateSW' or 'InjectManifest'
    },

    cordova: {
    },

    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      preloadScripts: [ 'electron-preload' ],
      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
      },

      builder: {
        appId: 'crm-system'
      }
    },
    bex: {
      extraScripts: []
    }
  }
});
