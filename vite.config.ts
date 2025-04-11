import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Cho phép truy cập từ các thiết bị khác trong LAN
    port: 5173,        // Chọn cổng tùy chỉnh (hoặc để mặc định là 5173)
    strictPort: true   // Không tự động đổi cổng nếu cổng bị chiếm
  }
})
