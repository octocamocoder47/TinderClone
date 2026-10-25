// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // Strict mode is used to make api calls twice just to make sure it works properly
  // <StrictMode>
    <App />
  // </StrictMode>,
)
