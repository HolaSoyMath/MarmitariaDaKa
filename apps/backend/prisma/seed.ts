import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const existing = await prisma.config.findFirst()
  if (!existing) {
    await prisma.config.create({ data: { gasPercentage: 0.05 } })
    console.log('Config criada com gasPercentage = 5%')
  } else {
    console.log('Config já existe, seed ignorado.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
