
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export function EditAndDeleButton({ id, path }: { id: string; path: string }) {
    const router = useRouter()

    const handleDelete = () => {
        console.log('deletar')
        try {
            fetch(`/api/customer/${id}`, {
                method: 'DELETE',
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = () => {
        console.log('editar ')
        router.push(path + '/' + id)
    }

    return (
        <div>
            <Button className="bg-blue-500 text-white mr-4 p-3" onClick={handleEdit}>
                <PencilIcon />
            </Button>
            <Button className="bg-red-500 text-white p-3" onClick={handleDelete}>
                <TrashIcon />
            </Button>
        </div>
    )
}
