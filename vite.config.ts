import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables including non-VITE_ ones for local server dev
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL && !process.env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }
  if (env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  }
  if (env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_SERVICE_KEY) {
    process.env.SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;
  }
  if (env.SUPABASE_URL && !process.env.SUPABASE_URL) {
    process.env.SUPABASE_URL = env.SUPABASE_URL;
  }
  if (env.VITE_SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
  }
  if (env.VITE_SUPABASE_ANON_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
    process.env.VITE_SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
  }
  if (env.ADMIN_ID && !process.env.ADMIN_ID) {
    process.env.ADMIN_ID = env.ADMIN_ID;
  }
  if (env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = env.ADMIN_PASSWORD;
  }


  return {
    server: {
      host: true,
    },
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const urlPath = req.url ? req.url.split('?')[0] : '';

            if (urlPath === '/api/check-link') {
              let bodyStr = '';
              req.on('data', (chunk) => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                try {
                  (req as any).body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch {
                  (req as any).body = bodyStr;
                }
                const mockRes = res as any;
                mockRes.status = (code: number) => {
                  res.statusCode = code;
                  return mockRes;
                };
                mockRes.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                };

                try {
                  const module = await import('./api/check-link.js');
                  await module.default(req, mockRes);
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Internal dev server error' }));
                }
              });
              return;
            }

            if (urlPath === '/api/check-message') {
              let bodyStr = '';
              req.on('data', (chunk) => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                try {
                  (req as any).body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch {
                  (req as any).body = bodyStr;
                }
                const mockRes = res as any;
                mockRes.status = (code: number) => {
                  res.statusCode = code;
                  return mockRes;
                };
                mockRes.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                };

                try {
                  const module = await import('./api/check-message.js');
                  await module.default(req, mockRes);
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Internal dev server error' }));
                }
              });
              return;
            }

            if (urlPath === '/api/dashboard-progress') {
              let bodyStr = '';
              req.on('data', (chunk) => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                try {
                  (req as any).body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch {
                  (req as any).body = bodyStr;
                }
                const mockRes = res as any;
                mockRes.status = (code: number) => {
                  res.statusCode = code;
                  return mockRes;
                };
                mockRes.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                };

                try {
                  const module = await import('./api/dashboard-progress.js');
                  await module.default(req, mockRes);
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Internal dev server error' }));
                }
              });
              return;
            }

            next();
          });
        }
      }
    ]
  };
});
