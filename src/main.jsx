import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='618970500177-4ndf92sk3pck1t8hn0541nljbb6hj8ni.apps.googleusercontent.com'>
      {/* <UserProvider> */}
      <App />
      {/* </UserProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>,
)
