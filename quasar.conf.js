// Configuration for your app


var config = require('./src/config.json');

module.exports = function (ctx) {
  return {
    plugins: [
      'i18n',
      'axios',
      'custom',
      'vuelidate'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      'mdi',
      //'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      env: ctx.dev ?
        {
          backendEndpoint: JSON.stringify(config.devURL)
        }
          :
        {
          backendEndpoint: JSON.stringify(config.prodURL)
        }
      ,
      extendWebpack(cfg) {
      }
    },
    devServer: {
      // https: true,
      // host: "10.0.0.83",
      port: 8100,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QPage',
        'QTab',
        'QLayoutFooter',
        'QBtnGroup',
        'QBtnDropdown',
        'QDialog',
        'QLayout',
        'QToolbar',
        'QToolbarTitle',
        'QSearch',
        'QTabs',
        'QRouteTab',
        'QBtn',
        'QIcon',
        'QItemSide',
        'QItemMain',
        'QListHeader',
        'QScrollArea',
        'QList',
        'QItem',
        'QChip',
        'QItemTile',
        'QInnerLoading',
        'QTooltip',
        'QField',
        'QInput',
        'QAutocomplete',
        'QModal',
        'QModalLayout',
        'QDatetime',
        'QFab',
        'QFabAction',
        'QPagination',
        'QCard',
        'QCardTitle',
        'QCardSeparator',
        'QCardMain',
        'QCardMedia',
        'QCardActions',
        'QSelect',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPageSticky',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QTableColumns',
        'QCheckbox',
        'QItemSeparator',
        'QPopover',
        'QCollapsible',
        'QChipsInput',
        'QRadio',
        'QTabPane',
        'QSlideTransition',
        'QToggle'
      ],
      directives: [
        'Ripple',
        'GoBack',
        'CloseOverlay'
      ],
      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'Screen',
        'LocalStorage'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        name: 'Quasar Frontend',
        short_name: 'QFrontend',
        description: 'Quasar frontend',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        start_url: "/",
        icons: [
          {
            'src': 'statics/icons/512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack(cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0-beta.4'
  }
}
