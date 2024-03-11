import { loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            kakaoappkey: env.VITE_APP_KAKAOMAP_API_KEY,
            cliendId: env.VITE_APP_CLIEND_ID,
            redirectUri: env.VITE_APP_REDIRECT_URI,
            apiurl: env.VITE_APP_API_URL,
          },
        },
      }),
    ],
  };
};
