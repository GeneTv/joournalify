module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    name: 'Joournalify',
    themeColor: '#1976d2',
    msTitleColor: '#1976d2',
    appleMobileWebAppCapable: true,
    manifestOptions: {
      start_url: '/',
      scope: "/",
      orientation: 'portrait',
      background_color: '#f5f5f5',
      icons: [
        {
          src: "/icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png"
        },
        {
          src: "/icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png"
        },
        {
          src: "/icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: "/icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png"
        },
        {
          src: "/icons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png"
        },
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      splash_pages: null
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: '/'
    }
  }
}