import { NextRequest, NextResponse } from "next/server";

// Endpoint de análise de arquitetura: recebe componentes e gera relatório STRIDE usando Gemini 2.5 Flash
export async function POST(req: NextRequest) {
  // Recebe o formData com a imagem (opcional) e os componentes
  const formData = await req.formData();
  const componentesStr = formData.get("componentes");
  let componentes: string[] = [];
  try {
    if (typeof componentesStr === "string") {
      componentes = JSON.parse(componentesStr);
    }
  } catch {
    // Se não for JSON válido, ignora
  }

  if (!componentes || componentes.length === 0) {
    return NextResponse.json({ erro: "Lista de componentes não enviada ou vazia." }, { status: 400 });
  }

  // Sanitiza os componentes para evitar blocos de código, aspas e outros caracteres
  const componentesSanitizados = componentes.map(c => String(c).replace(/[`"'\-]+/g, '').trim());
  // Prompt ajustado para respostas mais curtas, em Markdown, com introdução, mas sem títulos
  const prompt = `Gere um relatório STRIDE em português para a seguinte arquitetura de software, considerando os 
  componentes abaixo. O relatório deve trazer para cada ameaça STRIDE, os principais riscos e recomendações, tambem traga a quantidade de possiveis ameaças. 
  Responda apenas com o relatório em Markdown para toda a arquitetura, nao por componente, nao use titulos e nao gere uma introdução. 
  Use listas, negrito e outros recursos de Markdown quando apropriado. Não inclua frases como 'Aqui está o relatório' ou 'json'.\nComponentes:\n- ${componentesSanitizados.join("\n- ")}`;
  // Log do prompt enviado para debug
  console.log("[LOG] Prompt enviado ao Gemini:\n", prompt);

  // Obtém a API Key do Gemini da variável de ambiente
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ erro: "API Key do Gemini não configurada." }, { status: 500 });
  }

  // Monta o payload para a API do Gemini, limitando tokens se possível
  const geminiPayload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

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
    // Log detalhado da resposta do Gemini para debug
    console.log("[LOG] Resposta do Gemini:", JSON.stringify(data, null, 2));
    // Extrai a resposta do Gemini
    const resposta = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resposta || typeof resposta !== "string" || resposta.trim().length === 0) {
      console.error("[ERRO] Gemini não retornou texto na resposta.");
      return NextResponse.json({ erro: "O modelo Gemini não retornou texto para o relatório. Tente novamente ou ajuste o prompt." }, { status: 500 });
    }
    return NextResponse.json({ relatorio: resposta });
  } catch (e) {
    return NextResponse.json({ erro: "Erro geral ao gerar relatório com o Gemini." }, { status: 500 });
  }
} 