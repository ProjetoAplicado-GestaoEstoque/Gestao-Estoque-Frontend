"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";

const stockSchema = z.object({
  quantity: z.number().int().positive({
    message: 'Quantidade deve ser um número  positivo.',
  }),
  item_id: z.string().uuid({ message: "Item inválido." }),
  type: z.string(),
  description: z.string(),
});

export function StockForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      item_id:"",
      quantity: 0,
      type: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof stockSchema>) {
    try {
      const response = await fetch("/api/estoque", {
        method: "POST",
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
                <Input placeholder="Digite a descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CancelFormButton />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
