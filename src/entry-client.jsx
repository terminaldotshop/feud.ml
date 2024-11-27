// import '../index.css'

import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './generated/src/App.js'

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
      <App state={{
        running: true,
        questions: ["hello", "world"],
      }}/>
  </StrictMode>,
)
