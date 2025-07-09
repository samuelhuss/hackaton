// Página de documentação clean, estilo shadcn/ui
'use client'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'
import SidebarDocs from '@/components/ui/SidebarDocs'
import { H1, H2, H3, H4, P, List, Lead, Muted } from '@/components/ui/typography'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'


export default function DocsPage() {
  // Scroll suave ao clicar na sidebar
  useEffect(() => {
    const handleClick = (e: any) => {
      if (e.target.matches('.sidebar-link')) {
        e.preventDefault();
        const el = document.getElementById(e.target.getAttribute('href').slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-background md:pl-56">
      {/* Sidebar fixa (desktop) */}
      <SidebarDocs />
      {/* Conteúdo principal centralizado horizontalmente */}
      <main className="flex-1 max-w-4xl w-full mx-auto pt-32 pb-12 px-4 text-[15px]">
        {/* Título principal */}
        <H3 className="mb-2 flex items-center gap-2" id="introducao">
          SAGE AI <Badge variant="outline">Docs</Badge>
        </H3>
        <div className="mb-6 flex flex-wrap gap-3">
          <a href="https://github.com/samuelhuss/hackaton" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Badge variant="secondary">Frontend Repo</Badge>
          </a>
           <a href="https://github.com/samuelhuss/aws-architecture-model" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Badge variant="secondary">Yolo Repo</Badge>
          </a> 
          <a href="https://www.youtube.com/watch?v=fuaVpHtyBEo" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Badge variant="default">Ver vídeo</Badge>
          </a>
        </div>
        <Muted className="mb-8">Aplicação web para identificar automaticamente componentes em diagramas de arquitetura usando IA (<TooltipProvider><Tooltip><TooltipTrigger asChild><span className="underline cursor-help">Gemini 2.5 Flash</span></TooltipTrigger><TooltipContent>Modelo de IA do Google para análise de imagem e geração de texto</TooltipContent></Tooltip></TooltipProvider>) e gerar relatórios de ameaças (<TooltipProvider><Tooltip><TooltipTrigger asChild><span className="underline cursor-help">STRIDE</span></TooltipTrigger><TooltipContent>Metodologia de análise de ameaças</TooltipContent></Tooltip></TooltipProvider>).</Muted>

        {/* Experimentos com Machine Learning */}
       
        {/* Seção de vídeo de apresentação */}
        <section className="mb-12" id="demonstracao">
          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <HeroVideoDialog
                className="block dark:hidden"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/fuaVpHtyBEo?si=Yf--aNqsbZ9z9c0k"
                thumbnailSrc="aws-diagram.png"
                thumbnailAlt="Demonstração do projeto"
              />
              <HeroVideoDialog
                className="hidden dark:block"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/fuaVpHtyBEo?si=Yf--aNqsbZ9z9c0k"
                thumbnailSrc="aws-diagram.png"
                thumbnailAlt="Demonstração do projeto"
              />
            </div>
          </div>
        </section>
        {/* Visão Geral */}
        <section className="mb-12" id="visao-geral">
          <H4>Visão Geral </H4>
          <P>
            O sistema aceita <b>qualquer tipo de imagem de arquitetura</b> (PNG, JPG, SVG, etc), de qualquer provedor (AWS, Azure, GCP, Oracle, IBM, Alibaba, on-premises, etc), tornando-se uma solução flexível para times de arquitetura, segurança e desenvolvimento.
          </P>
          <P>
            Utilizamos IA para identificar automaticamente componentes, conexões e textos nos diagramas, permitindo análise de ameaças baseada na metodologias STRIDE.
          </P>
        </section>
         {/* Funcionalidades */}
         <section className="mb-12" id="funcionalidades">
          <H4>Funcionalidades</H4>
          <List>
            <li><b>Upload de Imagem de Arquitetura:</b> O usuário faz upload de um diagrama (ou seleciona um exemplo).</li>
            <li><b>Identificação Automática de Componentes:</b> A imagem é analisada por IA (Gemini 2.5 Flash), que retorna os componentes presentes no diagrama.</li>
            <li><b>Geração de Relatório:</b> O relatório é gerado de forma objetiva, com recomendações de segurança para cada ameaça, utilizando IA.</li>
            <li><b>Exportação:</b> Possibilidade de exportar o relatório (em breve: PDF, Markdown).</li>
          </List>
        </section>

     
        <section className="mb-12" id="ml-experimentos">
          <H4>Experimentos com Machine Learning</H4>
          <P>
            Antes de adotar a abordagem baseada em LLM, treinamos um modelo próprio de aprendizado de máquina para identificar componentes em diagramas. Utilizamos a biblioteca diagrams para gerar um dataset sintético, variando fundo, angulação e cor dos diagramas.
          </P>
          <P>
            Apesar dos esforços, a assertividade do modelo não atingiu o nível desejado para uso em produção. Por isso, optamos por utilizar uma LLM (Gemini 2.5 Flash) para a identificação automática de componentes, obtendo resultados mais robustos e flexíveis.
          </P>
        </section>
      
       
    
        {/* Abordagem e Diferenciais */}
        <section className="mb-12" id="abordagem">
          <H4>Abordagem e Diferenciais</H4>
          <List>
            <li><b>Agnóstico de provedor:</b> Não depende de padrões específicos. O reconhecimento é feito via <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="underline cursor-help">IA</span></TooltipTrigger><TooltipContent>Inteligência Artificial</TooltipContent></Tooltip></TooltipProvider>, analisando ícones, textos e conexões.</li>
            <li><b>Suporte a múltiplos formatos:</b> PNG, JPG, SVG e outros.</li>
            <li><b>Processamento inteligente:</b> <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="underline cursor-help">Gemini 2.5 Flash</span></TooltipTrigger><TooltipContent>Modelo de IA para OCR e classificação</TooltipContent></Tooltip></TooltipProvider> para OCR, classificação e geração de relatórios.</li>
            <li><b>Prompt dinâmico:</b> Engenharia de prompt adaptativa conforme o diagrama e metodologia.</li>
            <li><b>Interface moderna:</b> UI com shadcn/ui, Magic UI e Tailwind CSS, responsiva e acessível.</li>
          </List>
        </section>
        {/* Como funciona na prática */}
        <section className="mb-12" id="como-funciona">
          <H4>Como Funciona</H4>
          <List className="list-decimal">
            <li><b>Upload do diagrama:</b> O usuário faz upload de uma imagem de arquitetura (qualquer provedor ou padrão).</li>
            <li><b>Reconhecimento automático:</b> A IA processa a imagem, identifica componentes, conexões e lê textos (OCR).</li>
            <li><b>Geração do relatório:</b> O sistema utiliza prompts adaptativos para gerar um relatório objetivo e personalizado.</li>
            <li><b>Visualização e exportação:</b> O relatório pode ser visualizado e, futuramente, exportado em PDF ou Markdown.</li>
          </List>
        </section>
         {/* Tecnologias */}
         <section className="mb-12" id="tecnologias">
          <H4>Tecnologias Utilizadas</H4>
          <List>
            <li><Badge>Next.js</Badge> (App Router)</li>
            <li><Badge>TypeScript</Badge></li>
            <li><Badge>shadcn/ui</Badge> (componentes de UI acessíveis e modernos)</li>
            <li><Badge>Magic UI</Badge> (efeitos visuais e animações)</li>
            <li><Badge>Tailwind CSS</Badge> (estilização)</li>
            <li><Badge>Gemini 2.5 Flash</Badge> (Google AI para análise de imagem e geração de texto)</li>
          </List>
        </section>

        
        {/* Engenharia de Prompt */}
        <section className="mb-12" id="engenharia-prompt">
          <H4>Engenharia de Prompt</H4>
          <P>
            A engenharia de prompt é fundamental para garantir que a IA compreenda corretamente o contexto do diagrama e gere relatórios relevantes. Os prompts são montados dinamicamente, levando em conta:
          </P>
          <List>
            <li>O tipo de arquitetura (cloud, on-premises, híbrida, etc)</li>
            <li>O provedor (AWS, Azure, GCP, etc) — se detectável</li>
            <li>A metodologia de análise escolhida</li>
            <li>O nível de detalhamento desejado</li>
          </List>
          <Muted>
            Isso permite relatórios mais precisos, objetivos e adaptados à realidade do usuário.
          </Muted>
        </section>
        {/* Limitações e Futuro */}
        <section className="mb-12" id="limitacoes">
          <H4>Limitações e Futuro</H4>
          <List>
            <li>O reconhecimento depende da qualidade da imagem e da clareza dos ícones/textos</li>
            <li>O sistema pode não identificar componentes muito customizados ou fora do padrão visual</li>
            <li>Exportação de relatórios em PDF/Markdown e histórico de análises estão planejados</li>
            <li>Futuramente: suporte a múltiplos idiomas, autenticação, dashboard de métricas, integração com outros provedores cloud</li>
          </List>
        </section>
       
      </main>
    </div>
  )
} 