import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Tasks from './pages/Tasks.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tasks/>
  </StrictMode>,
)
