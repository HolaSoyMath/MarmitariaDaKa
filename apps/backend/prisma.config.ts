import { defineConfig } from 'prisma/config'

process.loadEnvFile()
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('Variavel de ambiente do banco de dados nao configurada')
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
})
