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

export default function AnalisesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [status, setStatus] = useState<"analisando" | "identificando" | "gerando" | null>(null);

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

  // Função chamada ao clicar em "Enviar"
  async function handleSendClick() {
    setErro(null);
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        // Envia a imagem para a API real
        const formData = new FormData();
        formData.append('imagem', file);
        const response = await fetch('/api/analisar', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Erro na análise');
        const relatorio = await response.json();
        // Salva o relatório no localStorage para a página de relatório consumir
        localStorage.setItem('relatorioStride', JSON.stringify(relatorio));
        toast.success("Relatório gerado com sucesso.");
        router.push("/analises/relatorio");
      } catch (e) {
        setErro("Erro ao processar a imagem. Tente novamente.");
        toast.error("Erro ao processar a imagem. Tente novamente.");
      } finally {
        setIsLoading(false);
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
        <h4 className="text-sm leading-none font-medium mb-4">Análise de Arquitetura</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Faça upload de uma imagem de arquitetura de software para gerar um relatório STRIDE automaticamente. O sistema irá identificar os componentes e ameaças de segurança.
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
                <img
                  src={imageUrl}
                  alt="Preview da imagem"
                  className="object-contain w-full h-full rounded-b-xl"
                />
              ) : (
                <span className="text-muted-foreground text-sm text-center px-4">Clique em "Adicionar" para fazer upload da arquitetura.</span>
              )}
            </AspectRatio>
            {/* Loader e mensagem de progresso sobrepostos durante o envio/análise */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/60 z-20 rounded-b-xl">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                <span className="text-base font-medium text-primary">Analisando imagem...</span>
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
      </section>
    </main>
  );
} 