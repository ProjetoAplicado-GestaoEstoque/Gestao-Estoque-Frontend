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

export function StockChangeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const changeType = [
    { id: 1, name: "Entrada" },
    { id: 2, name: "Saída" },
  ];

  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => onChange(String(value))}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Selecione um Tipo de Movimentação / Alteração`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tipo de Movimentação / Alteração</SelectLabel>
          {changeType.map((type) => (
            <SelectItem key={type.id} value={type.name}>
              {type.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
