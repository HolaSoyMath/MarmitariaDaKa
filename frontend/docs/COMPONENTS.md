# Frontend — Components Guide

Componentes compartilhados e padrões de UI por módulo.

---

## Componentes compartilhados (`components/shared/`)

### `WeekPicker`
Presente em **todas as páginas** no canto superior direito do header.

- Exibe: `Semana XX · Mês AAAA`
- Navegação por setas ← →
- Lê e escreve no `SemanaContext`
- Sem restrição de semana futura ou passada

### `IngredienteSelector`
Usado em: **Receitas** (gramagem) e **Compras** (quantidade + valor).

Ordem do dropdown:
```
1. Input de pesquisa (filtra por nome ao digitar)
2. + Cadastrar novo item  ← opção fixa no topo
3. Lista de ingredientes filtrados  ← formato "Nome — Unidade"
```

Modal "Cadastrar novo item":
- Campo: Nome (texto)
- Campo: Tipo — chips clicáveis: `g` `kg` `ml` `L` `un`
- Ao salvar: fecha modal e seleciona o novo ingrediente automaticamente no dropdown

### `StatusBadge`
Chip colorido para status de pedido:
- `pendente` — neutro
- `produzido` — amarelo/dourado
- `pago` — verde

---

## Padrões por módulo

### Home (`/`)

**Bloco — Card de totais:**
- Total de marmitas da semana
- "A produzir": quantidade de pedidos `pendente`
- "A receber": soma em R$ dos pedidos `produzido` (feito mas não pago)

**Bloco — Por prato:**
- Grade 2×2, máximo 4 pratos
- Chips de tamanho com quantidade por tamanho

**Bloco — Clientes da semana:**
- Seta `›` → accordion inline com itens do pedido
- Checkbox `✓` → marca pedido como `produzido`
- Dropdown ao lado → seleciona Pix ou Swile → marca como `pago`
- Sempre exibe ambos os valores (Pix e Swile) para todos os clientes

> Ações de marcar produzido e pago ocorrem **exclusivamente na Home**

---

### Pedidos (`/pedidos`)

**Lista:**
- Estado automático: "Com pedidos" ou "Vazio" (detectado pelo sistema)
- Empty state: "Nenhum pedido nessa semana ainda" + CTA "Registrar primeiro pedido"
- Colunas: `✓ FEITO` | `CLIENTE` | `ITENS` | `VALOR` | `PAGO`
- VALOR: método + valor para pagos (ex: "Pix R$ 78"); só valor Pix para pendentes
- Sem ações de status aqui — exclusivamente na Home

**Drawer "Novo pedido"** (abre sobre a lista, sem rota própria):
- Cliente: dropdown com busca + botão `+ novo` → abre modal de cliente
- Mesmo prato pode ter linhas para tamanhos diferentes (ex: 1× 550G + 1× 400G)
- Itens com quantidade 0 são ignorados ao salvar
- Rodapé: Total Pix e Total Swile em tempo real

---

### Cardápio (`/cardapio`)

**Modal "Adicionar prato ao cardápio":**
- Campo de busca de receitas
- Receitas já no cardápio: marcadas como "no cardápio" — bloqueadas mas visíveis
- Receitas disponíveis: botão `+ adicionar`
- Rodapé: link "Cadastre uma nova receita aqui" → navega para `/receitas`
- Sem criação de receita inline — precisa ir à tela de Receitas

**Card de prato:**
- Nome + chip "receita vinculada"
- Chips de tamanho (ex: 400G, 550G)
- Preview dos ingredientes truncado (ex: "Frango 200g · Arroz 150g ...")
- Botão `remover`

---

### Clientes (`/clientes`)

**Modal "Novo cliente" / "Editar cliente"** (mesmo componente em Pedidos e Clientes):
- Grupo: chips clicáveis, seleção exclusiva (um por vez)
- Chip `+ grupo` → abre modal de grupos por cima (modais empilhados)

**Modal "Grupos":**
- Lista com botão `renomear` por grupo
- Campo "Novo grupo" + botão `add`
- Exclusão com confirmação: "Todos os clientes deste grupo serão desativados junto"

---

### Compras & Custos (`/compras`)

Página única com duas abas: **Ingredientes** e **Custos gerais**

**Aba Ingredientes:**
- Quantidade: input livre + setas ↑↓
- Botão `×` remove linha
- Card inferior: "Custo de ingredientes (semana)" — soma em tempo real

**Aba Custos gerais — painel esquerdo:**
- Custos manuais: descrição editável + valor editável + botão salvar (aparece ao editar) + botão `×`
- Linha Gás: read-only, sem botão de remover, label "Gás (auto = 5% dos ingredientes)"
- Botão `+ adicionar custo`

**Aba Custos gerais — painel direito:**
- "Custo de ingredientes: R$ XX,00"
- "custos gerais + gás: R$ XX,00"
- Total consolidado — alimenta o Financeiro

---

### Financeiro (`/financeiro`)

**Toggle no topo:** "Por semana" | "Por mês" | "Período"
- Por semana: usa week picker global
- Por mês: seletor de mês, agrupa semanas
- Período: date range picker

**Cards de topo:**
- Custo Total (ingredientes + gerais + gás)
- Faturamento (pedidos `pago` apenas + qtd marmitas)
- Lucro (faturamento − custo, com margem %)

**Gráfico "Entrou × Saiu":**
- Barras amarela (faturamento) e vermelha (custo) lado a lado
- Modo semana: uma dupla de barras
- Modo mês/período: uma dupla por semana

**"Pratos mais pedidos":**
- Barra de progresso proporcional
- Chips de drill-down por tamanho com quantidade e faturamento

**"Pix vs Swile":**
- Dois cards: quantidade de pedidos + valor total por método