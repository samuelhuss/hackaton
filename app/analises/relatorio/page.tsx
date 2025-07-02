"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Lens } from "@/components/magicui/lens";

export default function RelatorioPage() {
  // Estado para armazenar a imagem recuperada do localStorage
  const [imagem, setImagem] = useState<string | null>(null);
  // Estado para armazenar o relatório STRIDE real
  const [relatorio, setRelatorio] = useState<any>(null);
  // Estado para armazenar os componentes identificados
  const [componentes, setComponentes] = useState<string[] | null>(null);
  // Estado para busca e ordenação
  const [busca, setBusca] = useState("");
  const [ordemAsc, setOrdemAsc] = useState(true);

  useEffect(() => {
    // Recupera a imagem salva no localStorage
    const img = localStorage.getItem("analiseImagem");
    setImagem(img);
    // Recupera o relatório STRIDE salvo no localStorage
    const rel = localStorage.getItem("relatorioStride");
    if (rel) {
      setRelatorio(JSON.parse(rel));
    }
    // Recupera os componentes identificados
    const comps = localStorage.getItem("componentesIdentificados");
    if (comps) {
      try {
        setComponentes(JSON.parse(comps));
      } catch {
        setComponentes(null);
      }
    }
  }, []);

  // Função para exportar/baixar o relatório (simples: print da página)
  function handleExport() {
    window.print();
  }

  // Função para copiar nome do componente
  function copiarComponente(nome: string) {
    navigator.clipboard.writeText(nome);
    toast.success("Componente copiado!");
  }

  // Filtra e ordena componentes
  const componentesFiltrados = (componentes || [])
    .filter((c) => typeof c === 'string' && c.replace(/^"|"$/g, '').toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      const aNome = typeof a === 'string' ? a.replace(/^"|"$/g, '').toLowerCase() : '';
      const bNome = typeof b === 'string' ? b.replace(/^"|"$/g, '').toLowerCase() : '';
      if (ordemAsc) return aNome.localeCompare(bNome);
      return bNome.localeCompare(aNome);
    });

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
        <h1 className="text-2xl font-semibold tracking-tighter mb-1 mt-8">Arquitetura de Software Analizada</h1>
        {/* Data e subtítulo */}
        <p className="text-muted-foreground mb-8 text-sm">Gerado em {new Date().toLocaleDateString("pt-BR")} &bull; Análise real</p>
        {/* Imagem centralizada */}
        {imagem && (
          <>
            <Lens>
              <AspectRatio ratio={16 / 9} className="w-full rounded-lg overflow-hidden">
                <Image
                  src={imagem}
                  alt="Imagem da arquitetura"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </AspectRatio>
            </Lens>
            <span className="text-xs text-muted-foreground mb-4 block text-center">Imagem enviada pelo usuário</span>
          </>
        )}
        {/* Componentes identificados */}
        {componentes && componentes.length > 0 && (
          <section className="mb-8">
            <h2 className="scroll-m-20 text-lg font-semibold tracking-tighter mt-12 mb-12">Componentes identificados</h2>
            {/* Busca e ordenação */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <input
                type="text"
                placeholder="Buscar componente..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto md:ml-0"
                onClick={() => setOrdemAsc(o => !o)}
                aria-label="Ordenar por nome"
              >
                Ordenar: {ordemAsc ? "A-Z" : "Z-A"}
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-20">Ordem</TableHead>
                  <TableHead className="text-center">Componente</TableHead>
                  <TableHead className="text-center w-16">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {componentesFiltrados.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-center font-mono">{i + 1}</TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help select-text">{typeof c === 'string' ? c.replace(/^"|"$/g, '') : c}</span>
                          </TooltipTrigger>
                          <TooltipContent>Copie ou pesquise sobre este componente</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copiarComponente(typeof c === 'string' ? c.replace(/^"|"$/g, '') : String(c))}
                              aria-label="Copiar nome do componente"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar nome</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
                {componentesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum componente encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </section>
        )}
        {/* Relatório textual do Ollama */}
        {(relatorio.relatorio || relatorio.response) && (
          <section className="mb-8">
            <h2 className="scroll-m-20 text-lg font-semibold tracking-tighter mt-12 mb-12">Relatório da Análise</h2>

            <div className="whitespace-pre-line text-sm bg-muted/10 text-black/80 rounded-lg p-12 tracking-tighter">
              <ReactMarkdown>
                {relatorio.relatorio || relatorio.response}
              </ReactMarkdown>
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

