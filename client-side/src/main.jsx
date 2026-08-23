import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import LoansProvider from './context/LoansProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoansProvider>
        <App />
      </LoansProvider>
    </BrowserRouter>
  </StrictMode>,
)