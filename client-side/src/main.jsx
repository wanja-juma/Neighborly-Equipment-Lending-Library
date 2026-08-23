import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'
=======
import { BrowserRouter } from "react-router-dom";
import LoansProvider from "./context/LoansProvider";
>>>>>>> 86d41b190c4d5b13b14a6414b1ed5d232d40b730
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <App />
    </BrowserRouter>
=======
  
      <LoansProvider>
        <App />
      </LoansProvider>
   
</BrowserRouter>
>>>>>>> 86d41b190c4d5b13b14a6414b1ed5d232d40b730
  </StrictMode>,
)