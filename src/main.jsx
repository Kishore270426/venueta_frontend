import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import clientId from './secrets.jsx';

//const clientIds = "800853033309-p60s6rqibcs03ntfs1belsjsnov1jh2j.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='1003591627213-ld2uhndumgh1ng58kmhmaa2fqdkdo8eo.apps.googleusercontent.com'>
  
      <App />
   
    </GoogleOAuthProvider>
  </StrictMode>,
);
