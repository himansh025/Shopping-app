import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "./store";
import { store,persistor } from '../src/store/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)
