import { CustomerList } from '@/components/Lists/CustomerList'
import { Card } from '@/components/ui/card'


export default function Page() {
  return (
    <div className="w-full p-6">
      <Card>
        <CustomerList />
      </Card>
    </div>
  )
}
