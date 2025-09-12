# 🔧 Configuração Completa do Render

## ✅ **Configurações Automáticas (já feitas):**

### **1. Arquivos de Configuração:**
- ✅ `package.json` - buildCommand: `./build.sh`
- ✅ `render.yaml` - buildCommand: `./build.sh`
- ✅ `build.sh` - Script de injeção da API key

## 🎯 **Configurações no Dashboard do Render:**

### **1. Acesse o Dashboard:**
- URL: https://dashboard.render.com
- Projeto: "estampai"

### **2. Configurações do Serviço:**

#### **A. Build & Deploy:**
- **Build Command**: Deixe vazio (usa o do package.json)
- **Publish Directory**: `.` (ponto)
- **Node Version**: `18` ou `20` (recomendado)

#### **B. Environment Variables:**
Adicione estas variáveis:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `[SUA_API_KEY_AQUI]` |
| `NODE_ENV` | `production` |
| `RENDER` | `true` |

#### **C. Headers (CORS):**
Adicione estes headers:

| Path | Name | Value |
|------|------|-------|
| `/*` | `Access-Control-Allow-Origin` | `*` |
| `/*` | `Access-Control-Allow-Methods` | `GET, POST, OPTIONS` |
| `/*` | `Access-Control-Allow-Headers` | `Content-Type, Authorization` |
| `/embed/*` | `X-Frame-Options` | `ALLOWALL` |
| `/embed/*` | `Content-Security-Policy` | `frame-ancestors *;` |

### **3. Configurações Avançadas:**

#### **A. Auto-Deploy:**
- ✅ **Auto-Deploy**: Habilitado
- ✅ **Branch**: `main`

#### **B. Health Check:**
- **Health Check Path**: `/` (opcional)

## 🔍 **Verificação do Deploy:**

### **Logs Esperados:**
```
==> Running build command './build.sh'...
🔧 Iniciando build do EstampAI...
✅ API Key encontrada: [API_KEY]...
🔄 Atualizando arquivos principais...
✅ index.html atualizado
✅ config.js atualizado
✅ embed/config.js atualizado
🔄 Atualizando embeds...
✅ estampai-embed.html atualizado
✅ estampai-embed-optimized.html atualizado
✅ estampai-embed-dark.html atualizado
✅ estampai-embed-compact.html atualizado
✅ estampai-embed-mobile.html atualizado
🎉 Build concluído com sucesso!
```

## ⚠️ **Importante:**

### **Build Command no Dashboard:**
- **NÃO** configure o Build Command no dashboard
- Deixe vazio para usar o do `package.json`
- O `package.json` já tem: `"buildCommand": "./build.sh"`

### **Se o Build Command estiver configurado no dashboard:**
1. Vá em **Settings** → **Build & Deploy**
2. **Build Command**: Deixe vazio
3. Salve as alterações
4. Faça um **Manual Deploy**

## 🚀 **Próximos Passos:**

1. **Configure a API Key** no dashboard
2. **Deixe o Build Command vazio** no dashboard
3. **Faça um Manual Deploy**
4. **Verifique os logs** para confirmar que o script rodou
5. **Teste os embeds** para confirmar que funcionam

## ✅ **Resultado Esperado:**

Após o deploy correto:
- ✅ Chat com IA funcionando
- ✅ Geração de estampas operacional
- ✅ Download das estampas
- ✅ Todos os sistemas integrados
- ✅ Sem erros 401 (Unauthorized)

---

**A configuração do Build Command no dashboard deve ficar VAZIA para usar o do package.json!** 🎯
