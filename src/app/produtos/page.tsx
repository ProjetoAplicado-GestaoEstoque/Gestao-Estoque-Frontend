import { Card } from '@/components/ui/card'
import { ItemsList } from '@/components/Lists/ItemsList'

export default function Page() {
  return (
    <div className="w-full p-6">
      <Card>
        <ItemsList />
      </Card>
    </div>
  )
}
