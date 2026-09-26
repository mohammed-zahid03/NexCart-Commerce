import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/reducers/store.js'
import "@fontsource/inter";
import "@fontsource/inter";
import "@fontsource/dm-serif-display";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "./index.css";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
        <App />
  </Provider>,
)
