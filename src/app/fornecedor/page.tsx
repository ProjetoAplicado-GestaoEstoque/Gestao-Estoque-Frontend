import { SupplierList } from '@/components/Lists/SupplierList'
import { Card } from '@/components/ui/card'

export default function Page() {
  return (
    <div className="w-full p-6 max-sm:p-0">
      <Card>
        <SupplierList />
      </Card>
    </div>
  )
}
