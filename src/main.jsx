import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='1003591627213-ld2uhndumgh1ng58kmhmaa2fqdkdo8eo.apps.googleusercontent.com'>
      {/* <UserProvider> */}
      <App />
      {/* </UserProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>,
)
