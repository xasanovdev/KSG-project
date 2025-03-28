// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    modules: ['nuxt-lucide-icons', '@pinia/nuxt', '@nuxtjs/supabase'],
    runtimeConfig: {
        public: {
          supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
          supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
        }
      },
    supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
});
