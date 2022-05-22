import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import path from 'path'

export default defineConfig({
  plugins: [RubyPlugin()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './app/javascript') },
      { find: '@components', replacement: path.resolve(__dirname, './app/javascript/components') },
      { find: '@models', replacement: path.resolve(__dirname, './app/javascript/models') },
      { find: '@helpers', replacement: path.resolve(__dirname, './app/javascript/helpers') },
    ],
  },
})
