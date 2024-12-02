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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomerSelector } from "@/components/SelectComponents/CustomerSelector";
import { UserSelector } from "../SelectComponents/UserSelector";
import { CancelFormButton } from "../CustomComponents/CancelFormButton";
import { useRouter } from 'next/navigation'

const projectSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome do projeto deve ter no mínimo 2 caracteres.',
  }),
  instituition: z.string().min(2, {
    message: 'Instituição deve ter no mínimo 2 caracteres.',
  }),
  project_manager_id: z.string().uuid({ message: "Gerente de Projeto Inválido" }),
  tech_responsible_id: z.string().uuid({ message: "Gerente de Projeto Inválido." }),
  customer_id: z.string().uuid({ message: "Gerente de Projeto Inválido." }),
});

export function ProjectsForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      instituition: "",
      project_manager_id:"",
      tech_responsible_id: "",
      customer_id: ""
    }
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(
          "Erro ao criar produto. Verifique os dados e tente novamente."
        );
      }
      console.log("Dados enviados com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    } finally {
      console.log("Processo finalizado.");
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
