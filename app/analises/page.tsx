// Página de análises minimalista e centralizada com upload funcional
"use client"
import { Button } from "@/components/ui/button";
import { UploadCloud, Send, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

export default function AnalisesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [status, setStatus] = useState<"analisando" | "identificando" | "gerando" | null>(null);
  const [exemploSelecionado, setExemploSelecionado] = useState(false);

  // Exemplos de imagens (adicione os caminhos das imagens de exemplo em /public)
  const exemplos = [
    "/aws-diagram.png",
    "/aws-2.png",
    // "/globe.svg",
    // Adicione mais exemplos aqui
  ];

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // Salva a imagem em base64 no localStorage para o relatório
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("analiseImagem", reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
      localStorage.removeItem("analiseImagem");
    }
  }

  // Função para converter arquivo em base64
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Função para carregar exemplo como base64
  function handleExemploClick(src: string) {
    setImageUrl(src);
    setExemploSelecionado(true);
    fetch(src)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem("analiseImagem", reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
  }

  // Função chamada ao clicar em "Enviar"
  async function handleSendClick() {
    setErro(null);
    let file = fileInputRef.current?.files?.[0];

    // Se for exemplo, converte base64 do localStorage para Blob/File
    if (!file && exemploSelecionado) {
      const base64 = localStorage.getItem("analiseImagem");
      if (base64) {
        const res = await fetch(base64);
        const blob = await res.blob();
        file = new File([blob], "exemplo.png", { type: blob.type });
      }
    }

    if (file) {
      setIsLoading(true);
      setStatus("analisando");
      try {
        // 1) Envia a imagem para o endpoint de identificação de componentes
        const formDataComponentes = new FormData();
        formDataComponentes.append('imagem', file);
        const componentesRes = await fetch('/api/componentes', {
          method: 'POST',
          body: formDataComponentes,
        });
        const componentesJson = await componentesRes.json();
        // Log detalhado da resposta dos componentes
        console.log("[LOG] Componentes identificados:", componentesJson);
        // Exibe toast informativo
        if (!componentesJson.componentes || componentesJson.componentes.length === 0) {
          throw new Error('Nenhum componente identificado.');
        }
        // Remove qualquer item que contenha '```', 'json' ou seja 'AWS Cloud' (bloco de código ou genérico)
        const componentesLimpos = componentesJson.componentes.filter((c: string) => {
          if (typeof c !== 'string') return false;
          if (c.includes('```')) return false;
          if (/json/i.test(c)) return false;
          if (c.trim().toLowerCase() === 'aws cloud') return false;
          return true;
        });
        localStorage.setItem('componentesIdentificados', JSON.stringify(componentesLimpos));
        setStatus("gerando");
        // 2) Envia a lista de componentes para o endpoint de análise
        const formDataAnalise = new FormData();
        formDataAnalise.append('componentes', JSON.stringify(componentesJson.componentes));
        const response = await fetch('/api/analisar', {
          method: 'POST',
          body: formDataAnalise,
        });
        if (!response.ok) throw new Error('Erro na análise');
        const relatorio = await response.json();
        // Salva o relatório no localStorage para a página de relatório consumir
        localStorage.setItem('relatorioStride', JSON.stringify(relatorio));
        toast.success("Relatório gerado com sucesso.");
        router.push("/analises/relatorio");
      } catch (e) {
        setErro("Erro ao processar a imagem ou gerar relatório. Tente novamente.");
        toast.error("Erro ao processar a imagem ou gerar relatório. Tente novamente.");
      } finally {
        setIsLoading(false);
        setStatus(null);
      }
    } else {
      setErro("Por favor, selecione uma imagem antes de enviar.");
    }
  }

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white px-4 items-center justify-center">
      {/* Coluna da esquerda: apenas título e descrição, centralizados verticalmente */}
      <section className="md:w-1/2 flex flex-col items-end justify-center min-h-screen py-8 px-4">
        <div className="max-w-xs text-left">
        <h4 className="text-sm leading-none font-medium mb-4">Análise de Arquitetura AWS</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Faça upload de uma imagem de arquitetura <b>AWS</b> para gerar um relatório STRIDE automaticamente. O sistema foi treinado e funciona apenas para diagramas AWS, identificando componentes e ameaças de segurança.
          </p>
        </div>
      </section>

      {/* Separator vertical centralizado entre as colunas */}
      <div className="hidden md:flex flex-col justify-center items-center h-full">
        <Separator orientation="vertical" className="block h-40 md:h-full min-h-[120px] mx-8" />
      </div>

      {/* Coluna da direita: área de upload, preview e botão de enviar, centralizados verticalmente */}
      <section className="md:w-1/2 flex flex-col items-start justify-center min-h-screen py-8 gap-6 w-full">
        {/* Input file escondido */}
        {/* Área de upload drag & drop (simples) + Botão de enviar, lado a lado */}
        {exemplos.length > 0 && (
          <div className="flex gap-2 mt-4 w-full max-w-md">
            {exemplos.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => handleExemploClick(src)}
                className="border rounded-lg overflow-hidden p-1 bg-muted hover:ring-2 ring-primary transition"
                title="Usar este exemplo"
              >
                <Image src={src} alt="Exemplo" width={64} height={64} className="object-contain" unoptimized />
              </button>
            ))}
          </div>
        )}
        <div className="w-full max-w-md rounded-xl shadow-xl border bg-background p-0 overflow-hidden relative">
          {/* Barra superior estilo Mac */}
          <div className="flex items-center gap-2 h-8 px-4 bg-muted border-b">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {/* Preview da imagem dentro do AspectRatio */}
          <div className="p-0">
            <AspectRatio ratio={16 / 9} className="w-full bg-gray-100 rounded-b-xl flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Preview da imagem"
                  fill
                  className="object-contain w-full h-full rounded-b-xl"
                  unoptimized
                />
              ) : (
                <span className="text-muted-foreground text-xs text-center px-4">Clique em &quot;Adicionar&quot; para fazer upload da arquitetura ou selecione um exemplo.</span>
              )}
            </AspectRatio>
            {/* Loader e mensagem de progresso sobrepostos durante o envio/análise */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/60 z-20 rounded-b-xl">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                <span className="text-base font-medium text-primary">
                  {status === "gerando" ? "Gerando relatório..." : "Analisando imagem..."}
                </span>
              </div>
            )}
          </div>
          {/* Mensagem de erro */}
          {erro && <span className="text-red-500 text-sm max-w-xs text-center block px-4 mt-2 mb-2">{erro}</span>}
        </div>
        {/* Botões fora do card, alinhados às pontas */}
        <TooltipProvider>
          <div className="max-w-md w-full flex justify-between items-center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-center ml-2"
                  onClick={handleButtonClick}
                  aria-label="Selecionar imagem para upload"
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {imageUrl ? "Alterar" : "Adicionar"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Faça upload da imagem da arquitetura.
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="justify-center mr-2"
                  variant="default"
                  onClick={handleSendClick}
                  disabled={!imageUrl || isLoading}
                  aria-disabled={!imageUrl || isLoading}
                >
                  Enviar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Envie para gerar o relatório STRIDE.
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        {/* Exemplos de imagens */}
       
      </section>
    </main>
  );
} 