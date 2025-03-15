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
import { ClientSelector } from '@/components/SelectComponents/ClientSelector'

const projectSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome do projeto deve ter no mínimo 2 caracteres.',
  }),
  instituition: z.string().min(2, {
    message: 'Instituição deve ter no mínimo 2 caracteres.',
  }),
  project_manager_id: z.string().uuid({
    message: 'Invalid project manager ID.',
  }),
  tech_responsible_id: z.string().uuid({
    message: 'Invalid tech responsible ID.',
  }),
  customer_id: z.string().uuid({
    message: 'Invalid customer ID.',
  }),
})

export function ProjectsForm() {
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

  function onSubmit(values: z.infer<typeof projectSchema>) {
    console.log(values)
    // Here you would typically send the form data to your server
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
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
                <Input placeholder="Enter institution name" {...field} />
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
                <Input placeholder="Enter project manager ID" {...field} />
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
                <Input placeholder="Enter tech responsible ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customer_id"
          render={() => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <ClientSelector />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Project</Button>
      </form>
    </Form>
  )
}
