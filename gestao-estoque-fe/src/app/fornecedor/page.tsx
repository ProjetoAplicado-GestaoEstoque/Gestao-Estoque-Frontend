import { Card } from '@/components/ui/card'
import { SupplierList } from '@/components/Lists/SupplierList'

export default function Page() {
  return (
    <div>
      <h1>Produtos</h1>
      <Card>
        <SupplierList></SupplierList>
      </Card>
    </div>
  )
}
