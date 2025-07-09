# SAGE AI

Este projeto é uma aplicação web desenvolvida em **Next.js** utilizando **shadcn/ui**, **Magic UI** e **Tailwind CSS**. O objetivo é identificar automaticamente componentes em diagramas de arquitetura enviados pelo usuário, utilizando IA (Gemini 2.5 Flash), e gerar relatórios de análise de ameaças de segurança (STRIDE) de forma rápida, acessível e personalizável.

---

## Funcionalidades

- **Upload de Imagem de Arquitetura:** O usuário faz upload de um diagrama (ou seleciona um exemplo).
- **Identificação Automática de Componentes:** A imagem é analisada por IA (Gemini 2.5 Flash), que retorna os componentes presentes no diagrama.
- **Geração de Relatório:** O relatório é gerado de forma objetiva, com recomendações de segurança para cada ameaça, utilizando IA.

---

## Como funciona o fluxo

1. **Upload:** O usuário faz upload de uma imagem de arquitetura.
2. **Identificação:** A imagem é enviada para a API `/api/componentes`, que utiliza o Gemini 2.5 Flash para identificar os componentes presentes.
3. **Geração do Relatório:** Após confirmação, a lista de componentes e a metodologia escolhida são enviadas para a API `/api/analisar`, que gera um relatório usando IA.
4. **Visualização:** O relatório é exibido na interface, podendo ser salvo ou exportado.

---

## Tecnologias Utilizadas

- **Next.js** (App Router)
- **TypeScript**
- **shadcn/ui** (componentes de UI acessíveis e modernos)
- **Magic UI** (efeitos visuais e animações)
- **Tailwind CSS** (estilização)
- **Gemini 2.5 Flash (Google AI)** para análise de imagem e geração de texto
- **Arquitetura modular por domínio** (`analises/`, `usuarios/`, `auth/`, etc)

---

## Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure a chave da API do Gemini:**
   - Crie um arquivo `.env.local` na pasta `frontend` com:
     ```
     GEMINI_API_KEY=sua_chave_aqui
     ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   - [http://localhost:3000](http://localhost:3000)

---

## Estrutura de Pastas

```
frontend/
  app/
    analises/         # Páginas e lógica de análise de arquitetura
    api/              # Endpoints de backend (Next.js API routes)
  components/
    ui/               # Componentes de UI (shadcn/ui)
    magicui/          # Efeitos visuais e animações (Magic UI)
  lib/                # Funções utilitárias
  public/             # Imagens e assets públicos
```

---

## Roadmap de Melhorias

- Exportação de relatórios (PDF, Markdown)
- Histórico de análises
- Suporte a múltiplos idiomas
- Autenticação e multiusuário
- Dashboard de métricas

---

## Licença

Este projeto é open-source e pode ser adaptado conforme sua necessidade.
