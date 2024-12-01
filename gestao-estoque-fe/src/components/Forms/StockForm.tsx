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
import { CancelFormButton } from "../CustomComponents/CancelFormButton";
import { ItemSelector } from "../SelectComponents/ItemSelector";
import { StockChangeSelector } from "../SelectComponents/StockChangeSelector";
import { useRouter, useParams  } from "next/navigation";
import { useEffect, useState } from "react";

const stockSchema = z.object({
  quantity: z.number().int().positive({
    message: 'Quantidade deve ser um número  positivo.',
  }),
  item_id: z.string().uuid({ message: "Item inválido." }),
  type: z.string(),
  description: z.string(),
})

export function StockForm() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      item_id:"",
      quantity: 0,
      type: '',
      description: '',
    },
  })

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/estoque/${id}`);
          if (!response.ok) throw new Error("Erro ao buscar Estoque.");
          const itemData = await response.json();
          form.setValue("item_id", itemData.item_id);
          form.setValue("quantity", itemData.quantity);
          form.setValue("type", itemData.type);
          form.setValue("description", itemData.description);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, form]);


  async function onSubmit(values: z.infer<typeof stockSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(
        id ? `/api/items/${id}` : "/api/estoque",
        {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(
          "Erro ao criar cliente. Verifique os dados e tente novamente."
        );
      }
      console.log("Dados enviados com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    } finally {
      console.log("Processo finalizado.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="item_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <FormControl>
                <ItemSelector value={field.value} onChange={field.onChange} />
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Movimentação</FormLabel>
              <FormControl>
                <StockChangeSelector
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                  <Input placeholder="Digite a descrição" {...field} disabled={isLoading} />
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
