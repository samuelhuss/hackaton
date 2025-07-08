# Analisador de Arquiteturas AWS com STRIDE e IA

Este projeto é uma aplicação web desenvolvida em **Next.js** com frontend moderno utilizando **shadcn/ui**, **Magic UI** e **Tailwind CSS**. O objetivo é identificar automaticamente componentes em diagramas de arquitetura AWS enviados pelo usuário, utilizando IA (Gemini 2.5 Flash), e gerar relatórios de análise de ameaças de segurança (STRIDE, LINDDUN, etc) de forma rápida, acessível e personalizável.

---

## Funcionalidades

- **Upload de Imagem de Arquitetura:** O usuário faz upload de um diagrama AWS (ou seleciona um exemplo).
- **Identificação Automática de Componentes:** A imagem é analisada por IA (Gemini 2.5 Flash), que retorna os componentes presentes no diagrama.
- **Revisão e Edição dos Componentes:** O usuário pode revisar, adicionar ou remover componentes detectados antes de gerar o relatório.
- **Escolha da Metodologia de Análise:** O usuário pode escolher entre diferentes metodologias de análise de ameaças (STRIDE, LINDDUN, etc).
- **Geração de Relatório:** O relatório é gerado de forma objetiva, com recomendações de segurança para cada ameaça, utilizando IA.
- **Interface Moderna e Responsiva:** Utiliza shadcn/ui, Magic UI e Tailwind CSS, com suporte a modo escuro e acessibilidade.
- **Arquitetura Limpa:** Separação clara entre lógica de apresentação, negócio e integração com IA.

---

## Como funciona o fluxo

1. **Upload:** O usuário faz upload de uma imagem de arquitetura AWS.
2. **Identificação:** A imagem é enviada para a API `/api/componentes`, que utiliza o Gemini 2.5 Flash para identificar os componentes presentes.
3. **Revisão:** Os componentes identificados são exibidos em um modal, permitindo edição manual.
4. **Escolha da Metodologia:** O usuário seleciona a metodologia de análise desejada (ex: STRIDE, LINDDUN) via Select.
5. **Geração do Relatório:** Após confirmação, a lista de componentes e a metodologia escolhida são enviadas para a API `/api/analisar`, que gera um relatório objetivo e enxuto usando IA.
6. **Visualização:** O relatório é exibido na interface, podendo ser salvo ou exportado.

---

## Tecnologias Utilizadas

- **Next.js** (App Router)
- **TypeScript**
- **shadcn/ui** (componentes de UI acessíveis e modernos)
- **Magic UI** (efeitos visuais e animações)
- **Tailwind CSS** (estilização)
- **Gemini 2.5 Flash (Google AI)** para análise de imagem e geração de texto
- **Arquitetura modular por domínio** (`analises/`, `usuarios/`, `auth/`, etc)
- **Clean Architecture** no frontend

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

## Personalização e Extensões

- **Adicionar novas metodologias:** Basta incluir no Select e ajustar o prompt enviado ao Gemini.
- **Adicionar novos componentes de UI:** Use o CLI do shadcn/ui.
- **Aprimorar prompts:** Edite os prompts nos endpoints para customizar o relatório.

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
