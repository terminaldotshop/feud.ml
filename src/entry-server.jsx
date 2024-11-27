import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './generated/src/App.js'

/**
 * @param {string} _url
 */
export function render(_url) {
  const html = renderToString(
    <StrictMode>
      <App state={{
        running: true,
        questions: ["hello", "world"],
      }}/>
    </StrictMode>,
  )
  return { html }
}
