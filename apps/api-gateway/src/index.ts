import dotenv from "dotenv";
dotenv.config();

import {
  createProxyMiddleware,
  type Options,
  type RequestHandler,
} from "http-proxy-middleware";
import express from "express";
import cors from "cors";
import { config } from "./env";

const app = express();
app.use(cors());

// WebSocket services
const wsServices = [
  {
    path: "/ws",
    url: config.WEB_SOCKETS_BE_SERVICE_URL,
    secure: true,
  },
  {
    path: "/webrtc",
    url: config.WEBRTC_SIGNALLING_SERVER_BE_SERVICE_URL,
    secure: true,
  },
];

// HTTP services (specific paths first)
const httpServices = [
  {
    path: "/my-razorpay-upi-payments",
    url: config.RAZORPAY_PAYMENTS_BE_SERVICE_URL,
  },
  {
    path: "/",
    url: config.NEXTJS_WEB_APP_SERVICE_URL,
  },
];

// Setup WebSocket proxies
const wsProxies = wsServices.map((service) => {
  const proxyOptions: Options = {
    target: service.url,
    ws: true,
    secure: service.secure,
    changeOrigin: true,
    pathRewrite: {
      "^/ws": "",
      "^/webrtc": "",
    },
    headers: {
      "X-Forwarded-Proto": "https",
    },
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
          proxyReq.setHeader("Authorization", req.headers.authorization);
        }
      },
    },
  };

  const proxy = createProxyMiddleware(proxyOptions) as RequestHandler & {
    upgrade: any;
  };

  return { path: service.path, proxy };
});

// Apply WebSocket proxies
wsProxies.forEach(({ path, proxy }) => {
  app.use(path, proxy);
});

// Setup HTTP proxies
httpServices.forEach((service) => {
  app.use(
    service.path,
    createProxyMiddleware({
      target: service.url,
      pathRewrite: { "^/": "/" },
      changeOrigin: true,
    })
  );
});

// Create server
const server = app.listen(config.PORT, () => {
  console.log(`API Gateway running on port ${config.PORT}`);
});

// Handle WebSocket upgrades
server.on("upgrade", (req, socket, head) => {
  const matchingProxy = wsProxies.find(({ path }) =>
    req.url?.startsWith(path)
  )?.proxy;

  matchingProxy ? matchingProxy.upgrade(req, socket, head) : socket.destroy();
});
