// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    modules: ['nuxt-lucide-icons', '@pinia/nuxt', '@nuxtjs/supabase'],
    runtimeConfig: {
        public: {
          supabaseUrl: 'https://djebdwdyuvexhfslieuw.supabase.co',
          supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZWJkd2R5dXZleGhmc2xpZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjA4MzgsImV4cCI6MjA1ODM5NjgzOH0.MmTPDIxaiIebxhCWknr6vlOyhOJhLvITHnUEWjvirkQ'
        }
      },
    supabase: {
        url: 'https://djebdwdyuvexhfslieuw.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZWJkd2R5dXZleGhmc2xpZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjA4MzgsImV4cCI6MjA1ODM5NjgzOH0.MmTPDIxaiIebxhCWknr6vlOyhOJhLvITHnUEWjvirkQ',
        redirect: false
    }
});
