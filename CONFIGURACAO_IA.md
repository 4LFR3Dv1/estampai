# 🤖 Configuração da Integração com IA (DALL-E 3)

## 🚀 **Sistema Implementado com Sucesso!**

O EstampAI agora está integrado com **DALL-E 3** para gerar estampas profissionais e realistas!

---

## 📋 **Como Configurar a API Key**

### 1. **Obter API Key da OpenAI**
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Faça login ou crie uma conta
3. Vá em **"API Keys"** → **"Create new secret key"**
4. Copie a chave gerada (começa com `sk-`)

### 2. **Configurar no EstampAI**
1. Abra o arquivo `config.js`
2. Encontre a linha:
   ```javascript
   apiKey: '', // ADICIONE SUA API KEY AQUI
   ```
3. Substitua por:
   ```javascript
   apiKey: 'sk-sua-chave-aqui', // SUA API KEY
   ```

### 3. **Testar a Integração**
1. Abra o `index.html` no navegador
2. Digite: *"Quero uma estampa de cruz"*
3. A IA deve gerar uma estampa realista!

---

## 💰 **Custos e Créditos**

### **Preços da OpenAI:**
- **DALL-E 3**: $0.04 por imagem (1024x1024px)
- **Créditos gratuitos**: $5 para novos usuários (~125 imagens)

### **Economia com Cache:**
- Sistema de cache implementado
- Imagens similares são reutilizadas
- Reduz custos significativamente

---

## 🎯 **Funcionalidades Implementadas**

### ✅ **Geração com IA:**
- **DALL-E 3** integrado
- **Prompts otimizados** para estampas
- **Fallback automático** se IA falhar
- **Cache inteligente** de imagens

### ✅ **Sistema Híbrido:**
- **IA primeiro**: Tenta gerar com DALL-E 3
- **Fallback**: Usa sistema manual se falhar
- **Transparente**: Usuário não percebe a diferença

### ✅ **Prompts Inteligentes:**
- **Análise do usuário** → **Prompt otimizado**
- **Estilos mapeados** para inglês
- **Cores traduzidas** para descrições
- **Mood e contexto** incluídos

---

## 🔧 **Exemplo de Prompt Gerado**

**Usuário digita:** *"Quero uma estampa de cruz"*

**Sistema gera:**
```
A high-quality t-shirt print design featuring:
- Style: religious, spiritual, sacred symbols, devotional
- Theme: Quero uma estampa de cruz
- Colors: black and white
- Mood: balanced, harmonious
- Size: medium scale
- Format: square design, transparent background, high resolution
- Quality: professional, print-ready, clean lines
- Composition: well-balanced, centered, suitable for clothing
```

---

## 🎨 **Estilos Suportados**

| **Estilo** | **Descrição IA** | **Exemplo** |
|------------|------------------|-------------|
| **Religioso** | religious, spiritual, sacred symbols | ✝️ Cruz, Jesus |
| **Geométrico** | geometric, precise, symmetrical | 🔷 Triângulos, quadrados |
| **Orgânico** | organic, natural, flowing shapes | 🌸 Flores, folhas |
| **Abstrato** | abstract, artistic, expressive | 🎨 Arte abstrata |
| **Figurativo** | figurative, representational | 🖼️ Desenhos realistas |
| **Símbolos** | symbolic, iconic, minimalist | 🔣 Ícones, logos |

---

## 🚀 **Como Usar**

### **Prompts Efetivos:**
```
"Quero uma estampa de cruz em preto e branco"
"Crie uma estampa floral elegante com tons de rosa"
"Faça uma estampa geométrica vibrante em azul"
"Estampa abstrata divertida e colorida"
"Símbolos religiosos em dourado"
```

### **Resultados Esperados:**
- ✅ **Estampas profissionais** geradas por IA
- ✅ **Qualidade alta** (1024x1024px)
- ✅ **Fundo transparente** para camisetas
- ✅ **Cores precisas** conforme solicitado
- ✅ **Composição equilibrada** para roupas

---

## ⚙️ **Configurações Avançadas**

### **No arquivo `config.js`:**
```javascript
ai: {
    openai: {
        apiKey: 'sua-chave-aqui',
        model: 'dall-e-3',
        size: '1024x1024',        // Tamanho da imagem
        quality: 'standard',      // 'standard' ou 'hd'
        style: 'natural'          // 'natural' ou 'vivid'
    },
    fallback: {
        enabled: true,            // Usa sistema manual se IA falhar
        showMessage: true         // Mostra mensagem quando usa fallback
    },
    cache: {
        enabled: true,            // Cache de imagens
        maxSize: 50,             // Máximo de imagens em cache
        ttl: 24 * 60 * 60 * 1000 // 24 horas
    }
}
```

---

## 🔍 **Troubleshooting**

### **Problemas Comuns:**

1. **"API Key não configurada"**
   - Verifique se a chave está no `config.js`
   - Certifique-se de que não há espaços extras

2. **"Erro HTTP 401"**
   - API Key inválida ou expirada
   - Verifique se tem créditos na conta

3. **"Erro HTTP 429"**
   - Limite de requisições excedido
   - Aguarde alguns minutos

4. **"Imagem não carrega"**
   - Problema de CORS
   - Sistema usa fallback automaticamente

### **Logs do Console:**
- ✅ `"Estampa gerada com IA: [URL]"`
- ⚠️ `"IA falhou, usando sistema de fallback"`
- ❌ `"Erro ao gerar estampa com IA: [erro]"`

---

## 🎉 **Resultado Final**

**Agora você tem:**
- ✅ **Estampas profissionais** geradas por IA
- ✅ **Sistema híbrido** (IA + fallback)
- ✅ **Cache inteligente** para economia
- ✅ **Prompts otimizados** automaticamente
- ✅ **Integração transparente** para o usuário

**Teste agora com:**
- *"Quero uma estampa de cruz"*
- *"Crie uma estampa floral elegante"*
- *"Faça uma estampa geométrica vibrante"*

---

**🚀 O EstampAI agora gera estampas reais e profissionais com IA!**
