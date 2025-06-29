"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function RelatorioPage() {
  // Estado para armazenar a imagem recuperada do localStorage
  const [imagem, setImagem] = useState<string | null>(null);
  // Estado para armazenar o relatório STRIDE real
  const [relatorio, setRelatorio] = useState<any>(null);

  useEffect(() => {
    // Recupera a imagem salva no localStorage
    const img = localStorage.getItem("analiseImagem");
    setImagem(img);
    // Recupera o relatório STRIDE salvo no localStorage
    const rel = localStorage.getItem("relatorioStride");
    if (rel) {
      setRelatorio(JSON.parse(rel));
    }
  }, []);

  // Função para exportar/baixar o relatório (simples: print da página)
  function handleExport() {
    window.print();
  }

  if (!relatorio) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center text-muted-foreground text-lg">Nenhum relatório encontrado. Por favor, faça uma análise primeiro.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 bg-background">
      {/* Linha de botões: Voltar à esquerda, Exportar à direita, apenas ícones com tooltip */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar para upload</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" onClick={handleExport}>
                <Download className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exportar relatório</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Conteúdo do documento */}
      <article className="w-full max-w-2xl mx-auto">
        {/* Título alinhado à esquerda e com espaçamento menor do topo */}
        <h1 className="text-2xl font-semibold mb-1 mt-8">Relatório STRIDE da Arquitetura</h1>
        {/* Data e subtítulo */}
        <p className="text-muted-foreground mb-8 text-sm">Gerado em {new Date().toLocaleDateString("pt-BR")} &bull; Análise real</p>
        {/* Imagem centralizada */}
        {imagem && (
          <div className="flex flex-col items-center mb-8">
            <img src={imagem} alt="Imagem da arquitetura" className="max-h-80 object-contain" />
            <span className="text-xs text-muted-foreground mt-2">Imagem enviada pelo usuário</span>
          </div>
        )}
        {/* Componentes identificados */}
        <section className="mb-8">
          <h3 className="text-sm leading-none font-medium mb-2">Componentes identificados</h3>
          <ul className="list-disc list-inside text-sm">
            {relatorio.componentes?.map((comp: string) => (
              <li key={comp}>{comp}</li>
            ))}
          </ul>
        </section>
        {/* Seções STRIDE como blocos de texto */}
        {relatorio.stride?.map((item: any, idx: number) => (
          <section key={item.tipo} className="mb-8">
            <h4 className="text-sm leading-none font-medium mb-2">{idx + 1}. {item.tipo}</h4>
            <p className="mb-1 text-muted-foreground text-xs"><span className="font-medium text-black">Descrição:</span> {item.descricao}</p>
            <p className="text-muted-foreground text-xs"><span className="font-medium text-black">Recomendação:</span> {item.recomendacao}</p>
          </section>
        ))}
       
      </article>
    </main>
  );
} 