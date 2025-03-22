import { CustomerList } from '@/components/Lists/CustomerList'
<<<<<<< HEAD

export default function Page() {
  return (
<<<<<<< HEAD:src/app/clientes/page.tsx
    <div className="w-full p-6">
      <ClientList />
=======
    <div>
      <CustomerList />
>>>>>>> 90f3dd9d (Adicionando Editar nos formulários e os botões de editar e deletar nas listas.):gestao-estoque-fe/src/app/clientes/page.tsx
=======
import { Card } from '@/components/ui/card'

export default function Page() {
  return (
    <div className="w-full p-6">
      <Card>
        <CustomerList />
      </Card>
>>>>>>> b3f7f93f (chore: fixing project structure)
    </div>
  )
}
