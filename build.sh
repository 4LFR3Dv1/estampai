#!/bin/bash

# Script de Build para EstampAI
# Substitui placeholders pela API key real durante o deploy

echo "🔧 Iniciando build do EstampAI..."

# Verifica se a variável de ambiente existe
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Erro: OPENAI_API_KEY não encontrada nas variáveis de ambiente"
    echo "💡 Configure a variável OPENAI_API_KEY no Render Dashboard"
    exit 1
fi

echo "✅ API Key encontrada: ${OPENAI_API_KEY:0:20}..."

# Substitui placeholders nos arquivos principais
echo "🔄 Atualizando arquivos principais..."

# index.html
if [ -f "index.html" ]; then
    sed -i "s/YOUR_OPENAI_API_KEY_HERE/$OPENAI_API_KEY/g" index.html
    echo "✅ index.html atualizado"
fi

# index-modern.html (arquivo principal com melhorias)
if [ -f "index-modern.html" ]; then
    sed -i "s/YOUR_OPENAI_API_KEY_HERE/$OPENAI_API_KEY/g" index-modern.html
    echo "✅ index-modern.html atualizado"
fi

# config.js
if [ -f "config.js" ]; then
    sed -i "s/YOUR_OPENAI_API_KEY_HERE/$OPENAI_API_KEY/g" config.js
    echo "✅ config.js atualizado"
fi

# embed/config.js
if [ -f "embed/config.js" ]; then
    sed -i "s/YOUR_OPENAI_API_KEY_HERE/$OPENAI_API_KEY/g" embed/config.js
    echo "✅ embed/config.js atualizado"
fi

# Substitui placeholders nos embeds
echo "🔄 Atualizando embeds..."

for file in embed/estampai-embed*.html; do
    if [ -f "$file" ]; then
        sed -i "s/YOUR_OPENAI_API_KEY_HERE/$OPENAI_API_KEY/g" "$file"
        echo "✅ $(basename "$file") atualizado"
    fi
done

echo "🎉 Build concluído com sucesso!"
echo "📦 Arquivos prontos para deploy"
