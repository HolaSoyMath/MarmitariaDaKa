"use client";

import { usePathname } from "next/navigation";
import { WeekPicker } from "@/components/ui/WeekPicker";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/cardapio": { title: "Cardápio da semana", subtitle: "Cardápio da Semana" },
  "/receitas": { title: "Receitas", subtitle: "Cadastro de Pratos" },
  "/ingredientes": {
    title: "Ingredientes",
    subtitle: "Cadastro de Ingredientes",
  },
  "/clientes": { title: "Clientes", subtitle: "Lista de Clientes" },
  "/compras": { title: "Compras & Custos", subtitle: "Compras e Custos" },
  "/financeiro": { title: "Financeiro", subtitle: "Dashboard Financeiro" },
  "/pedidos": { title: "Pedidos", subtitle: "Pedidos Feitos" },
  "/precos": { title: "Preços", subtitle: "Tabela de Preços" },
  "/": { title: "Home", subtitle: "" },
};

function getPageMeta(pathname: string) {
  const sorted = Object.entries(PAGE_META).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const match = sorted.find(([key]) => {
    if (key === "/") return pathname === "/";
    return pathname.startsWith(key);
  });
  return match?.[1] ?? { title: "Marmitaria", subtitle: "" };
}

export function Header() {
  const pathname = usePathname();
  const { title, subtitle } = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3.5 border-b border-border px-7.5 py-4.5 bg-[color-mix(in_oklch,var(--background)_88%,transparent)] backdrop-blur-sm">
      <div className="flex flex-col">
        <h1 className="font-heading font-extrabold text-[25px] leading-tight tracking-tight whitespace-nowrap">
          {title}
        </h1>
        {subtitle && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex-1" />
      <WeekPicker />
    </header>
  );
}
