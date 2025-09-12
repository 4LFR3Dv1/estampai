# 🎨 Guia EstampAI para Framer

## 🚨 Limitações do Framer

O Framer tem várias limitações que impedem o funcionamento completo do EstampAI:

### ❌ O que NÃO funciona no Framer:
- **Chamadas de API externas** (OpenAI, etc.)
- **JavaScript complexo** com fetch/XMLHttpRequest
- **localStorage/IndexedDB** (pode ser bloqueado)
- **Scripts de terceiros** (analytics, etc.)
- **Comunicação entre iframes**

### ✅ O que funciona no Framer:
- **Interface visual** básica
- **Interação do usuário** (cliques, inputs)
- **CSS e animações**
- **JavaScript simples** (DOM manipulation)

## 🔧 Soluções Disponíveis

### 1. **Versão Compatível com Framer** (Recomendada)
```
https://estampai.onrender.com/embed/framer-compatible.html
```

**Características:**
- ✅ Interface idêntica ao original
- ✅ Chat funcional com respostas pré-definidas
- ✅ Sem dependências externas
- ✅ Otimizada para iframe
- ✅ Funciona 100% no Framer

### 2. **Versão Simplificada**
```
https://estampai.onrender.com/embed/framer-simple.html
```

**Características:**
- ✅ Interface minimalista
- ✅ Chat básico
- ✅ Debug integrado
- ✅ Testes de funcionalidade

### 3. **Versão de Debug**
```
https://estampai.onrender.com/embed/framer-debug.html
```

**Características:**
- 🔍 Diagnóstico completo
- 📊 Testes de APIs
- 🚫 Identificação de bloqueios
- 📝 Logs detalhados

## 📱 Como Implementar no Framer

### Passo 1: Adicionar Embed
1. No Framer, adicione um elemento **"Embed"**
2. Cole a URL da versão compatível:
   ```
   https://estampai.onrender.com/embed/framer-compatible.html
   ```

### Passo 2: Configurar Dimensões
```css
Largura: 100%
Altura: 600px (ou conforme necessário)
```

### Passo 3: Configurar Atributos
```html
<iframe 
    src="https://estampai.onrender.com/embed/framer-compatible.html"
    width="100%" 
    height="600" 
    frameborder="0"
    allow="clipboard-write"
    title="EstampAI - Gerador de Estampas"
    sandbox="allow-scripts allow-same-origin allow-forms"
></iframe>
```

## 🎯 Funcionalidades da Versão Compatível

### ✅ O que funciona:
- **Chat interativo** com respostas inteligentes
- **Interface responsiva** e moderna
- **Tema escuro** personalizado
- **Animações suaves**
- **Histórico de conversa** (em memória)
- **Auto-resize** do input
- **Feedback visual** (loading, status)

### 🔄 Respostas Inteligentes:
A versão compatível usa um sistema de respostas pré-definidas que:
- Analisa a entrada do usuário
- Seleciona respostas relevantes
- Simula conversação natural
- Fornece sugestões criativas

## 🚀 Alternativas para Funcionalidade Completa

### Opção 1: Link Direto
Adicione um botão no Framer que redireciona para:
```
https://estampai.onrender.com
```

### Opção 2: Popup/Modal
Use JavaScript para abrir o EstampAI em uma nova janela:
```javascript
function openEstampAI() {
    window.open('https://estampai.onrender.com', '_blank', 'width=800,height=600');
}
```

### Opção 3: Integração via API
Para funcionalidade completa, considere:
- Usar o EstampAI como serviço backend
- Implementar chamadas de API do seu próprio servidor
- Usar webhooks para comunicação

## 🔍 Debugging no Framer

### Verificar Console:
1. Abra DevTools (F12)
2. Vá para Console
3. Procure por erros relacionados a:
   - `CORS`
   - `X-Frame-Options`
   - `Content-Security-Policy`
   - `fetch` ou `XMLHttpRequest`

### Testar Funcionalidades:
Use a versão de debug para identificar problemas:
```
https://estampai.onrender.com/embed/framer-debug.html
```

## 📞 Suporte

Se precisar de funcionalidade completa no Framer, considere:

1. **Implementação customizada** - Desenvolver uma versão específica
2. **Integração via backend** - Usar o EstampAI como API
3. **Solução híbrida** - Embed + redirecionamento

## 🎨 Personalização

A versão compatível pode ser personalizada editando:
- Cores e tema
- Respostas pré-definidas
- Layout e dimensões
- Animações e transições

---

**💡 Dica:** A versão compatível oferece uma experiência de chat realista e funcional, mesmo sem acesso à API da OpenAI. É perfeita para demonstrações e captura de leads no Framer!
