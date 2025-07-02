import { NextRequest, NextResponse } from "next/server";

// Função auxiliar para extrair lista de componentes de uma resposta textual
function extrairComponentes(resposta: any): string[] {
  if (Array.isArray(resposta)) {
    // Já é um array
    return resposta.map(String);
  }
  if (typeof resposta === "string") {
    // Tenta fazer parse como JSON
    try {
      const arr = JSON.parse(resposta);
      if (Array.isArray(arr)) return arr.map(String);
    } catch {}
    // Tenta extrair itens de uma lista textual (ex: "- API Gateway\n- Banco de Dados")
    const linhas = resposta.split(/\r?\n|,/).map(l => l.replace(/^[-*\d.\s]+/, "").trim()).filter(Boolean);
    // Filtra linhas muito curtas ou genéricas
    return linhas.filter(l => l.length > 2 && !/^componentes?/i.test(l));
  }
  return [];
}

// Endpoint para identificar componentes em uma imagem usando Gemini 2.5 Flash
export async function POST(req: NextRequest) {
  // Recebe o formData com a imagem
  const formData = await req.formData();
  const file = formData.get("imagem");

  if (!file || typeof file === "string") {
    return NextResponse.json({ erro: "Imagem não enviada." }, { status: 400 });
  }

  // Lê o arquivo como ArrayBuffer
  const arrayBuffer = await (file as Blob).arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString("base64");

  // Monta o payload para a API do Gemini
  const geminiPayload = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: (file as Blob).type || "image/png",
              data: base64Image
            }
          },
          {
            text: "Identifique todos os componentes de arquitetura de software presentes nesta imagem, não pegue os nomes que aparecem na imagem, apenas os componentes de acordo com a biblioteca diagrams. Responda apenas com uma lista em JSON, sem explicações."
          }
        ]
      }
    ]
  };

  // Obtém a API Key do Gemini da variável de ambiente
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ erro: "API Key do Gemini não configurada." }, { status: 500 });
  }

  try {
    // Chama a API do Gemini 2.5 Flash
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload)
      }
    );

    if (!geminiRes.ok) {
      const erro = await geminiRes.text();
      return NextResponse.json({ erro: "Erro ao chamar o Gemini: " + erro }, { status: 500 });
    }

    const data = await geminiRes.json();
    // Extrai a resposta do Gemini
    const resposta = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    // Garante que sempre retorna array de strings
    const componentes = extrairComponentes(resposta);

    return NextResponse.json({ componentes });
  } catch (e) {
    return NextResponse.json({ erro: "Erro geral ao identificar componentes." }, { status: 500 });
  }
} 