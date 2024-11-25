import { Card } from '@/components/ui/card'
import { ProductList } from '@/components/Lists/ProductList'

export default function Page() {
  return (
    <div>
      <h1>Produtos</h1>
      <Card>
        <ProductList></ProductList>
      </Card>
    </div>
  )
}
