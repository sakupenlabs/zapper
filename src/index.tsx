import { StarknetProvider } from 'components/Web3Provider'
import { createRoot } from 'react-dom/client'
import ThemeProvider, { ThemedGlobalStyle } from 'theme'

import App from './App'

const container = document.getElementById('root')
if (!container) throw 'Undefined #root container'

const root = createRoot(container)
root.render(
  <StarknetProvider>
    <ThemeProvider>
      <ThemedGlobalStyle />
      <App />
    </ThemeProvider>
  </StarknetProvider>
)
