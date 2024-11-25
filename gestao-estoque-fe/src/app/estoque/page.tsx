import { Card } from '@/components/ui/card'
import { StockList } from '@/components/Lists/StockList'

export default function Page() {
  return (
    <div>
      <h1>Produtos</h1>
      <Card>
        <StockList></StockList>
      </Card>
    </div>
  )
}
