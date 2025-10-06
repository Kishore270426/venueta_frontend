import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='800853033309-950kriq89s5npjck3tpg0qppk0lue4h3.apps.googleusercontent.com'>
      {/* <UserProvider> */}
      <App />
      {/* </UserProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>,
)
