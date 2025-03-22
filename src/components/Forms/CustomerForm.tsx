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
import { CancelFormButton } from '../CustomComponents/CancelFormButton'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const customerSchema = z.object({
  cnpj: z.string().length(14, {
    message: 'CNPJ deve conter 14 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, insira um endereço de e-mail válido.',
  }),
})

export function CustomerForm() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      cnpj: '',
      email: '',
    },
  })

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/customer/${id}`)
          if (!response.ok) throw new Error('Erro ao buscar cliente.')
          const customerData = await response.json()
          form.setValue('cnpj', customerData.cnpj)
          form.setValue('email', customerData.email)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [id, form])

  async function onSubmit(values: z.infer<typeof customerSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch(
        id ? `/api/customer/${id}` : '/api/customer',
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      )

      if (!response.ok) {
        throw new Error(
          'Erro ao processar cliente. Verifique os dados e tente novamente.',
        )
      }
      router.back()
    } catch (error) {
      console.error('Erro ao processar cliente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o CNPJ"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite o email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CancelFormButton />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processando...' : id ? 'Atualizar' : 'Criar'}
        </Button>
      </form>
    </Form>
  )
}
