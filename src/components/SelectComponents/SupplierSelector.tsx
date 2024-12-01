import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export function SupplierSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [fornecedores, setFornecedores] = useState<{ id: string; corporate_name: string; cnpj: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await fetch("/api/supplier");
        if (response.ok) {
          const data = await response.json();
          setFornecedores(data.supplier);
        } else {
          console.error("Erro ao buscar fornecedores:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={loading ? "Carregando..." : "Selecione um fornecedor"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fornecedor</SelectLabel>
          {fornecedores?.map((fornecedor) => (
            <SelectItem key={fornecedor.id} value={fornecedor.id}>
              <b>Nome:</b> {fornecedor.corporate_name}  <b>CNPJ:</b> {fornecedor.cnpj}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
