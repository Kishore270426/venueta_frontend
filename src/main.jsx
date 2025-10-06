import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='1003591627213-nns8lfu4i7hk7mh8u1p5nbiebgovp8nh.apps.googleusercontent.com'>
      {/* <UserProvider> */}
      <App />
      {/* </UserProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>,
)
