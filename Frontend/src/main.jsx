import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
const clientID = import.meta.env.VITE_CLIENT_ID;



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
<GoogleOAuthProvider clientId={clientID}>
    <App />
      </GoogleOAuthProvider>
        
    </Provider>
  </StrictMode>,
)
