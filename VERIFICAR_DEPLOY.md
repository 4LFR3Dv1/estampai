# 🚨 **Verificar Deploy no Render.com**

## **🔍 Problema Identificado:**
- **Erro:** `Failed to load resource: A server with the specified hostname could not be found`
- **Causa:** Backend Node.js não está rodando no Render.com

## **✅ Passos para Verificar e Corrigir:**

### **1. 🔍 Verificar Status do Deploy**

#### **1.1 Acessar Render Dashboard:**
1. Vá para [render.com](https://render.com)
2. Faça login na sua conta
3. Procure pelo serviço `estampai-unified`

#### **1.2 Verificar Status:**
- **✅ Verde:** Serviço rodando
- **🟡 Amarelo:** Build em andamento
- **❌ Vermelho:** Erro no deploy

### **2. 🔧 Se o Deploy Falhou:**

#### **2.1 Verificar Logs:**
1. Clique no serviço `estampai-unified`
2. Vá na aba **Logs**
3. Procure por erros como:
   - `npm install` falhou
   - `npm start` falhou
   - Variáveis de ambiente não configuradas

#### **2.2 Erros Comuns:**

**Erro: "npm install" falhou**
```bash
# Solução: Verificar package.json
npm install
```

**Erro: "STRIPE_SECRET_KEY not found"**
```bash
# Solução: Configurar variáveis de ambiente
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
```

**Erro: "Port not specified"**
```bash
# Solução: Verificar se server.js usa process.env.PORT
const PORT = process.env.PORT || 3000;
```

### **3. 🚀 Forçar Novo Deploy:**

#### **3.1 Deploy Manual:**
1. No dashboard do Render
2. Clique em **Manual Deploy**
3. Selecione **Deploy latest commit**

#### **3.2 Deploy via Git:**
```bash
# Fazer um commit vazio para forçar deploy
git commit --allow-empty -m "Force deploy"
git push origin main
```

### **4. 🔑 Configurar Variáveis de Ambiente:**

#### **4.1 No Render Dashboard:**
1. Vá em **Environment**
2. Adicione as variáveis:
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_aqui
STRIPE_MODE=live
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui
GOOGLE_ANALYTICS_ID=G-E0Z97STDKV
OPENAI_API_KEY=sk-sua_chave_openai_aqui
```

#### **4.2 Verificar se foram salvas:**
- Todas as variáveis devem aparecer na lista
- Valores não devem estar vazios

### **5. ✅ Testar Backend:**

#### **5.1 Verificar se está rodando:**
```bash
# URL do backend
https://estampai-unified.onrender.com

# Deve retornar a página principal
```

#### **5.2 Testar API:**
```bash
# Testar endpoint de variáveis
https://estampai-unified.onrender.com/api/env-vars

# Deve retornar JSON com as chaves
```

### **6. 🔧 Se Ainda Não Funcionar:**

#### **6.1 Verificar package.json:**
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "stripe": "^14.7.0",
    "dotenv": "^16.3.1"
  }
}
```

#### **6.2 Verificar server.js:**
```javascript
// Deve ter estas linhas
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
```

---

## **🎯 Logs Esperados Após Correção:**

```
🚀 Servidor rodando na porta 3000
🔑 Modo Stripe: live
📊 Analytics: G-E0Z97STDKV
✅ Variáveis de ambiente carregadas do backend
💳 Processando pagamento real via Stripe
✅ Sessão real criada via backend
```

---

**🔧 Siga estes passos para corrigir o problema!** 🚀
