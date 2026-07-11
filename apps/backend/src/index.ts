import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { groupsRoutes } from './routes/groups'
import { clientsRoutes } from './routes/clients'
import { ingredientsRoutes } from './routes/ingredients'
import { recipesRoutes } from './routes/recipes'
import { weeksRoutes } from './routes/weeks'
import { priceTypesRoutes } from './routes/priceTypes'
import { menuItemsRoutes } from './routes/menuItems'
import { ordersRoutes } from './routes/orders'
import { purchasesRoutes } from './routes/purchases'
import { generalCostsRoutes } from './routes/generalCosts'
import { financialRoutes } from './routes/financial'
import { configRoutes } from './routes/config'

if (!process.env.PORT) throw new Error('Variável de ambiente PORT não definida')
const port = Number(process.env.PORT)

const app = new Elysia()
  .use(cors({ origin: [/localhost/, /\.vercel\.app$/, /\.studiomath\.com\.br$/] }))
  .get('/health', () => ({ status: 'API funcionando!', timestamp: new Date().toISOString() }))
  .use(groupsRoutes)
  .use(clientsRoutes)
  .use(ingredientsRoutes)
  .use(recipesRoutes)
  .use(weeksRoutes)
  .use(priceTypesRoutes)
  .use(menuItemsRoutes)
  .use(ordersRoutes)
  .use(purchasesRoutes)
  .use(generalCostsRoutes)
  .use(financialRoutes)
  .use(configRoutes)

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`)
})

export type App = typeof app
export default app
