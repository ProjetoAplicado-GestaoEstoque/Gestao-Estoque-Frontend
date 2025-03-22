<<<<<<< HEAD:src/components/CustomComponents/EditAndDeleButton.tsx

import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
=======
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { RedirectType, useRouter } from 'next/navigation'

>>>>>>> 90f3dd9d (Adicionando Editar nos formulários e os botões de editar e deletar nas listas.):gestao-estoque-fe/src/components/CustomComponents/EditAndDeleButton.tsx

export function EditAndDeleButton({ id, path }: { id: string; path: string }) {
    const router = useRouter()

    const handleDelete = () => {
<<<<<<< HEAD:src/components/CustomComponents/EditAndDeleButton.tsx
        console.log('deletar')
        try {
            fetch(`/api/customer/${id}`, {
                method: 'DELETE',
=======
        console.log("deletar")
        try {
            fetch(`/api/customer/${id}`, {
                method: 'DELETE'
>>>>>>> 90f3dd9d (Adicionando Editar nos formulários e os botões de editar e deletar nas listas.):gestao-estoque-fe/src/components/CustomComponents/EditAndDeleButton.tsx
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = () => {
<<<<<<< HEAD:src/components/CustomComponents/EditAndDeleButton.tsx
        console.log('editar ')
        router.push(path + '/' + id)
=======
        console.log("editar ")
        router.push(path + "/" + id)
>>>>>>> 90f3dd9d (Adicionando Editar nos formulários e os botões de editar e deletar nas listas.):gestao-estoque-fe/src/components/CustomComponents/EditAndDeleButton.tsx
    }

    return (
        <div>
<<<<<<< HEAD:src/components/CustomComponents/EditAndDeleButton.tsx
            <Button className="bg-blue-500 text-white mr-4 p-3" onClick={handleEdit}>
                <PencilIcon />
            </Button>
            <Button className="bg-red-500 text-white p-3" onClick={handleDelete}>
                <TrashIcon />
            </Button>
        </div>
    )
}
=======
            <Button className="bg-blue-500 text-white mr-4 p-3" onClick={handleEdit}><PencilIcon /></Button>
            <Button className="bg-red-500 text-white p-3" onClick={handleDelete}><TrashIcon /></Button>
        </div>
    )
}
>>>>>>> 90f3dd9d (Adicionando Editar nos formulários e os botões de editar e deletar nas listas.):gestao-estoque-fe/src/components/CustomComponents/EditAndDeleButton.tsx
