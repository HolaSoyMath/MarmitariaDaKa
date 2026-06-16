import { Elysia } from 'elysia'
import { gruposRoutes } from './routes/grupos'
import { clientesRoutes } from './routes/clientes'
import { ingredientesRoutes } from './routes/ingredientes'
import { receitasRoutes } from './routes/receitas'

if (!process.env.PORT) throw new Error('Variável de ambiente PORT não definida')
const port = Number(process.env.PORT)

const app = new Elysia()
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .use(gruposRoutes)
  .use(clientesRoutes)
  .use(ingredientesRoutes)
  .use(receitasRoutes)

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`)
})

export type App = typeof app
export default app
