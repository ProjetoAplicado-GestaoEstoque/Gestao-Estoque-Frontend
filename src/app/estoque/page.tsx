import { Card } from '@/components/ui/card'
import { StockList } from '@/components/Lists/StockList'

export default function Page() {
  return (
    <div className="w-full p-6 max-sm:p-0">
      <Card>
        <StockList />
      </Card>
    </div>
  )
}
