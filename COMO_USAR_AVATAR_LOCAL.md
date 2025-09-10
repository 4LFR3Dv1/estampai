# 🖼️ EstampAI - Como Usar Avatar Local

## ✅ **Não Precisa Ser URL!**

### **🎯 Opções Disponíveis:**

#### **1. Arquivo Local (Recomendado):**
- ✅ **Salvar imagem** na pasta do projeto
- ✅ **Sem dependência** de internet
- ✅ **Controle total** da imagem
- ✅ **Funciona offline**

#### **2. URL Externa:**
- ✅ **Imagem hospedada** online
- ✅ **Fácil de trocar** sem modificar código
- ❌ **Pode falhar** se URL não funcionar

#### **3. Upload do Usuário:**
- ✅ **Usuário faz upload** da própria foto
- ✅ **Experiência personalizada**
- ✅ **Sistema processa** automaticamente

---

## 🚀 **Como Usar Arquivo Local:**

### **Passo 1: Prepare Sua Imagem**
- ✅ **Formato**: JPG, PNG, WebP
- ✅ **Resolução**: 400x500px (recomendado)
- ✅ **Orientação**: Retrato (pessoa em pé)
- ✅ **Qualidade**: Alta resolução

### **Passo 2: Salve na Pasta Correta**
```
/Users/renan/Desktop/EstampAI/assets/images/avatar.jpg
```

### **Passo 3: Configure no Sistema**
```javascript
// No config.js
avatar: {
    useRealImage: true,
    imagePath: 'assets/images/avatar.jpg', // ← SEU ARQUIVO
    imageUrl: '', // Deixe vazio se usar arquivo local
    fallbackToDrawn: true
}
```

---

## 📁 **Estrutura de Pastas:**

```
EstampAI/
├── assets/
│   └── images/
│       ├── avatar.jpg          ← SUA IMAGEM AQUI
│       ├── avatar.png          ← OU AQUI
│       └── avatar.webp         ← OU AQUI
├── config.js
├── script.js
└── index.html
```

---

## 🎨 **Exemplos de Configuração:**

### **Opção 1: Arquivo Local (Recomendado)**
```javascript
avatar: {
    useRealImage: true,
    imagePath: 'assets/images/avatar.jpg', // ← Arquivo local
    imageUrl: '', // Vazio
    fallbackToDrawn: true
}
```

### **Opção 2: URL Externa**
```javascript
avatar: {
    useRealImage: true,
    imagePath: '', // Vazio
    imageUrl: 'https://sua-imagem.com/avatar.jpg', // ← URL
    fallbackToDrawn: true
}
```

### **Opção 3: Ambos (Fallback)**
```javascript
avatar: {
    useRealImage: true,
    imagePath: 'assets/images/avatar.jpg', // ← Tenta primeiro
    imageUrl: 'https://sua-imagem.com/avatar.jpg', // ← Fallback
    fallbackToDrawn: true
}
```

---

## 🔧 **Sistema de Prioridade:**

### **Ordem de Carregamento:**
1. **Arquivo local** (`imagePath`) - Prioridade 1
2. **URL externa** (`imageUrl`) - Prioridade 2
3. **Avatar desenhado** - Fallback final

### **Código Implementado:**
```javascript
// Tenta arquivo local primeiro, depois URL
if (ESTAMPAI_CONFIG.avatar.imagePath) {
    img.src = ESTAMPAI_CONFIG.avatar.imagePath;
} else if (ESTAMPAI_CONFIG.avatar.imageUrl) {
    img.src = ESTAMPAI_CONFIG.avatar.imageUrl;
} else {
    console.warn('Nenhuma imagem de avatar configurada');
    drawDrawnAvatar(ctx, width, height, stamp);
}
```

---

## 💡 **Vantagens do Arquivo Local:**

### **✅ Prós:**
- **Sem dependência** de internet
- **Controle total** da imagem
- **Funciona offline**
- **Carregamento mais rápido**
- **Sem problemas de CORS**
- **Privacidade** (imagem não sai do seu servidor)

### **❌ Contras:**
- **Precisa** salvar o arquivo
- **Ocupa espaço** no projeto
- **Não pode trocar** facilmente

---

## 🎯 **Recomendação:**

### **Para Desenvolvimento:**
- ✅ **Use arquivo local** para testes
- ✅ **Controle total** da imagem
- ✅ **Funciona sempre**

### **Para Produção:**
- ✅ **Use arquivo local** para avatar padrão
- ✅ **Permita upload** do usuário
- ✅ **URL como fallback**

---

## 🚀 **Como Implementar Agora:**

### **1. Salve Sua Imagem:**
```
/Users/renan/Desktop/EstampAI/assets/images/avatar.jpg
```

### **2. Configure no config.js:**
```javascript
avatar: {
    useRealImage: true,
    imagePath: 'assets/images/avatar.jpg', // ← SUA IMAGEM
    imageUrl: '', // Deixe vazio
    fallbackToDrawn: true
}
```

### **3. Teste o Sistema:**
- ✅ **Abra** o EstampAI
- ✅ **Crie** uma estampa
- ✅ **Veja** seu avatar real

---

## 🎉 **Resultado:**

### **O EstampAI agora:**
- ✅ **Carrega** sua imagem local
- ✅ **Aplica** estampas naturalmente
- ✅ **Funciona** sem internet
- ✅ **Controle total** da imagem

### **Para o Usuário:**
- 🖼️ **Avatar personalizado** com sua imagem
- 🎨 **Estampas aplicadas** naturalmente
- ⚡ **Carregamento rápido** e confiável
- 🎯 **Experiência personalizada**

---

**🎭 Agora você pode usar sua própria imagem como avatar!**

**Basta salvar na pasta e configurar no sistema!** ✨🖼️🎨
