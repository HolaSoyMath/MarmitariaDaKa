import { prisma } from '../lib/prisma'

try {
  await prisma.$queryRaw`SELECT 1`
  console.log('conectou')
} catch (e: any) {
  console.log('nao conectou:', e.message)
} finally {
  await prisma.$disconnect()
}
