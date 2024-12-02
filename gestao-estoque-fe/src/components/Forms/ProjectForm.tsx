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
import { CustomerSelector } from '@/components/SelectComponents/CustomerSelector'
import { UserSelector } from '../SelectComponents/UserSelector'
import { CancelFormButton } from '../CustomComponents/CancelFormButton'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '@/axios/api'
import { User } from '@/types/types'

const projectSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome do projeto deve ter no mínimo 2 caracteres.',
  }),
  instituition: z.string().min(2, {
    message: 'Instituição deve ter no mínimo 2 caracteres.',
  }),
  project_manager_id: z
    .string()
    .uuid({ message: 'Gerente de Projeto Inválido' }),
  tech_responsible_id: z
    .string()
    .uuid({ message: 'Gerente de Projeto Inválido.' }),
  customer_id: z.string().uuid({ message: 'Gerente de Projeto Inválido.' }),
})

export function ProjectsForm() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [userPm, setUserPm] = useState<User[]>([])
  const [userRt, setUserRt] = useState<User[]>([])

  const fetchedUserPmRef = useRef(false)
  const fetchedUserRtRef = useRef(false)
  const fetchedCustomerRef = useRef(false)

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      instituition: '',
      project_manager_id: '',
      tech_responsible_id: '',
      customer_id: '',
    },
  })

  useEffect(() => {
    if (id && !fetchedCustomerRef.current) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const projectResponse = await fetch(`/api/project/${id}`)
          if (!projectResponse.ok) throw new Error('Erro ao buscar cliente.')
          const projectData = await projectResponse.json()

          form.setValue('name', projectData.name)
          form.setValue('instituition', projectData.instituition)
          form.setValue('customer_id', projectData.customer_id)
          form.setValue('tech_responsible_id', projectData.tech_responsible.id)
          form.setValue('project_manager_id', projectData.project_manager.id)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
      fetchedCustomerRef.current = true
    }
  }, [form, id])

  useEffect(() => {
    if (!fetchedUserPmRef.current) {
      const fetchUsersPM = async () => {
        setIsLoading(true)
        try {
          const response = await axiosInstance.get('/api/user/role/pm')
          setUserPm(response.data.users || [])
        } catch (error) {
          console.error('Erro ao buscar usuários PM:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchUsersPM()
      fetchedUserPmRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!fetchedUserRtRef.current) {
      const fetchUsersRT = async () => {
        setIsLoading(true)
        try {
          const response = await axiosInstance.get('/api/user/role/rt')
          setUserRt(response.data.users || [])
        } catch (error) {
          console.error('Erro ao buscar usuários RT:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchUsersRT()
      fetchedUserRtRef.current = true
    }
  }, [])

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      const response = await fetch(id ? `/api/project/${id}` : '/api/project', {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Projeto</FormLabel>
              <FormControl>
                <Input placeholder="Digite o Nome do Projeto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instituition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instituição</FormLabel>
              <FormControl>
                <Input placeholder="Digite o Nome da Instituição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project_manager_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gerente do projeto</FormLabel>
              <FormControl>
                <UserSelector
                  users={userPm || []}
                  titulo="Gerente de Projeto"
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
          name="tech_responsible_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável pelo Projeto </FormLabel>
              <FormControl>
                <UserSelector
                  users={userRt || []}
                  titulo="Responsável Tecnico"
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
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <CustomerSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CancelFormButton />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}
