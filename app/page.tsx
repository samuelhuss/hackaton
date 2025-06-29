// Landing page padronizada: duas colunas, centralização igual à tela de análises
"use client";
import { Separator } from "@/components/ui/separator";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white px-4 items-center justify-center">
      {/* Coluna da esquerda: conteúdo alinhado à direita, centralizado verticalmente */}
      <section className="md:w-1/2 flex flex-col items-end justify-center min-h-screen py-8 gap-4">
        <BoxReveal boxColor="#000" duration={0.7}>
          <div className="flex items-center gap-2">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              SAGE
            </h2>
            <Badge variant="outline" className="text-xs px-2 py-0.5"> Beta </Badge>
          </div>
        </BoxReveal>
        <div className="inline-block  mb-2">
          <Separator className="my-1" />
          <BoxReveal boxColor="#000" duration={0.7}>
            <p className="text-muted-foreground text-right">
              Software Architecture Graph & Evaluation
            </p>
          </BoxReveal>
        </div>
        {/* Tooltip padrão no botão 'Começar' */}
        <BoxReveal boxColor="#000" duration={0.7}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="default" onClick={() => router.push('/analises')}>
                Começar
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Iniciar análise de arquitetura.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </BoxReveal>
      </section>

      {/* Separator vertical centralizado entre as colunas */}
      <div className="hidden md:flex flex-col justify-center items-center h-full">
        <Separator orientation="vertical" className="block h-40 md:h-full min-h-[120px] mx-8" />
      </div>

      {/* Coluna da direita: explicação da ferramenta, centralizada verticalmente, com globe decorativo */}
      <section className="md:w-1/2 flex flex-col items-start justify-center min-h-screen py-8 w-full relative overflow-hidden">
        {/* Globe decorativo no fundo */}
        <div className="w-full max-w-md flex flex-col gap-4 relative z-10">
          <h4 className="text-sm leading-none font-medium">O que é o SAGE?</h4>
          <p className="text-muted-foreground text-sm">
            SAGE é uma ferramenta inteligente para análise de arquitetura de software. Faça upload de diagramas, identifique automaticamente componentes, gere relatórios STRIDE e visualize ameaças de forma simples, rápida e visual.
          </p>
        </div>
      </section>
    </main>
  );
}
