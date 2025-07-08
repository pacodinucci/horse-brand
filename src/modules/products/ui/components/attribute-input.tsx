import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import { useState } from "react";

interface AttributeInputProps {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
}

export function AttributeInput({
  label,
  values,
  onChange,
}: AttributeInputProps) {
  const [input, setInput] = useState("");

  const addValue = () => {
    const v = input.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setInput("");
  };

  return (
    <div>
      {/* <label className="block font-semibold">{label}</label> */}
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-2 py-1 flex-1 max-w-48 bg-white"
          placeholder={`Agregar ${label.toLowerCase()}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") addValue();
          }}
        />
        <Button
          type="button"
          onClick={addValue}
          className="rounded px-3 py-1 bg-[var(--var-brown-grey)] hover:bg-[var(--var-brown-grey)]/80 text-neutral-100"
          variant={"outline"}
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((val, idx) => (
          <span
            key={val + idx}
            className={`${
              label.toLowerCase() === "color"
                ? "bg-[var(--var-brown-dark)]"
                : label.toLowerCase() === "material"
                ? "bg-[var(--var-brown)]"
                : label.toLowerCase() === "medida"
                ? "bg-[var(--var-brick)]"
                : "bg-[var(--var-teal)]"
            } rounded-xl text-xs font-semibold tracking-wide text-neutral-100 px-2 py-1 flex items-center gap-1`}
          >
            {val}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== idx))}
              className="ml-1 text-[var(--var-grey)] font-bold cursor-pointer hover:text-[var(--var-grey)]/60"
              aria-label="Quitar"
            >
              <X className="p-1" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
