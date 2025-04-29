'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CancelFormButton } from '../CustomComponents/CancelFormButton'
import { useRouter, useParams } from 'next/navigation'
import { SupplierSelector } from '../SelectComponents/SupplierSelector'
import { ProjectSelector } from '../SelectComponents/ProjectSelector'
import { useEffect } from 'react'
import { useItemQueryById } from '@/hooks/Items'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome do produto deve ter no mínimo 2 caracteres.',
  }),
  storage: z.string().min(1, {
    message: 'Local de armazenamento é obrigatório.',
  }),
  description: z.string().optional(),
  supplier_id: z.string().uuid({ message: 'Fornecedor Inválido.' }),
  project_id: z.string().uuid({ message: 'Projeto Inválido.' }),
  quantity: z.number().int().positive({
    message: 'Quantidade deve ser um número  positivo.',
  }),
})

export function ItemForm() {
  const router = useRouter()
  const { id } = useParams()
  const { data, isLoading, error } = useItemQueryById(id as string, {
    enabled: !!id,
  })

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      storage: '',
      description: '',
      quantity: 0,
      supplier_id: '',
      project_id: '',
    },
  })

  useEffect(() => {
    if (id && !isLoading) {
      form.setValue('name', data?.name ?? '')
      form.setValue('storage', data?.storage ?? '')
      form.setValue('quantity', data?.quantity ?? 0)
      form.setValue('supplier_id', data?.supplier.id ?? '')
      form.setValue('project_id', data?.project.id ?? '')
      form.setValue('description', data?.description)
    } else {
      console.log(error?.message)
    }
  }, [id, form, isLoading])

  async function onSubmit(values: z.infer<typeof itemSchema>) {
    try {
      const response = await fetch(id ? `/api/items/${id}` : '/api/items', {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(
          'Erro ao criar produto. Verifique os dados e tente novamente.',
        )
      }
      console.log('Dados enviados com sucesso!')
      router.back()
    } catch (error) {
      console.error('Erro ao criar produto:', error)
    } finally {
      console.log('Processo finalizado.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do Produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="storage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local de Armazenamento</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o local de armazenamento"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite uma descrição (opcional)"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite a quantidade"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplier_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fornecedor</FormLabel>
              <FormControl>
                <SupplierSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projetos</FormLabel>
              <FormControl>
                <ProjectSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CancelFormButton path={'/produtos'} />
        <Button type="submit">
          {isLoading ? 'Processando...' : id ? 'Atualizar' : 'Criar'}
        </Button>
      </form>
    </Form>
  )
}
