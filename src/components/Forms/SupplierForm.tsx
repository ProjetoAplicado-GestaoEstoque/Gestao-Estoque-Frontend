/* eslint-disable @typescript-eslint/no-unused-vars */
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

const supplierSchema = z.object({
  corporate_name: z.string().min(2, {
    message: 'O nome corportaivo deve ter no mínimo 2 caracteres.',
  }),
  cnpj: z.string().length(14, {
    message: 'CNPJ deve conter no mínimo 14 caracteres.',
  }),
  phone: z.string().min(10, {
    message: 'O telefone deve ter no mínimo 10 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, insira um endereço de e-mail válido.',
  }),
  address: z.string().min(5, {
    message: 'O Endereço deve ter no mínimo 5 caracteres.',
  }),
})

export function SupplierForm() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      corporate_name: '',
      cnpj: '',
      phone: '',
      email: '',
      address: '',
    },
  })

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/supplier/${id}`)
          if (!response.ok) throw new Error('Erro ao buscar Fornecedor.')
          const itemData = await response.json()
          form.setValue('corporate_name', itemData.corporate_name)
          form.setValue('cnpj', itemData.cnpj)
          form.setValue('phone', itemData.phone)
          form.setValue('email', itemData.email)
          form.setValue('address', itemData.address)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [id, form])

  async function onSubmit(values: z.infer<typeof supplierSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch(
        id ? `/api/supplier/${id}` : '/api/supplier',
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
          'Erro ao criar fornecedor. Verifique os dados e tente novamente.',
        )
      }
      console.log('Dados enviados com sucesso!')
      router.back()
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error)
    } finally {
      console.log('Processo finalizado.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="corporate_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome corportaivo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome corporativo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="Digite o CNPJ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Digite o telefone" {...field} />
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
                <Input type="email" placeholder="Digite o email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Digite o Endereco" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <CancelFormButton path={'/fornecedor'} />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}
