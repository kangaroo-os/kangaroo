import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import path from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app/javascript'),
      '@components': path.resolve(__dirname, './app/javascript/components'),
      '@shared': path.resolve(__dirname, './app/javascript/components/shared'),
      '@models': path.resolve(__dirname, './app/javascript/models'),
      '@hooks': path.resolve(__dirname, './app/javascript/hooks'),
      '@store': path.resolve(__dirname, './app/javascript/store'),
      '@helpers': path.resolve(__dirname, './app/javascript/helpers'),
      '@reducers': path.resolve(__dirname, './app/javascript/reducers'),
    },
  }
})
