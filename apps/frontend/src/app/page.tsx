import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Marmitaria da Ká</h1>
      <div className="flex gap-2">
        <Button>Primário</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destrutivo</Button>
      </div>
      <div className="flex gap-2">
        <Badge>Pendente</Badge>
        <Badge variant="secondary">Produzido</Badge>
        <Badge variant="outline">Pago</Badge>
      </div>
    </div>
  )
}
