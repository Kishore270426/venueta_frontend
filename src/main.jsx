import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='260241037443-irotoh5dl3hco11ef44r26gnlsmhsu4q.apps.googleusercontent.com'>
      {/* <UserProvider> */}
      <App />
      {/* </UserProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>,
)
