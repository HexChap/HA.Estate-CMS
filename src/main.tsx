import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ruRU from "antd/locale/ru_RU"
import { ConfigProvider } from "antd";
import { Provider as ReduxProvider } from 'react-redux'

import App from './pages/index/App.tsx'
import ClientCreate from './pages/clientele/Client.tsx';
import './index.css'
import { store } from "./stores";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/clientele",
    element: <ClientCreate />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={ruRU}>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </ConfigProvider>
  </StrictMode>
);
