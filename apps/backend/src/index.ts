import { Elysia } from 'elysia'
import { PORT } from './lib/constants'

const app = new Elysia()
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})

export type App = typeof app
export default app
