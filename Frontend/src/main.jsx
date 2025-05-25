import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from '../src/store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientID = import.meta.env.VITE_CLIENT_ID;
const apiUrl = import.meta.env.VITE_API_URL;



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
<GoogleOAuthProvider clientId={clientID}>
    <App />
      </GoogleOAuthProvider>
        
    </Provider>
  </StrictMode>,
)
