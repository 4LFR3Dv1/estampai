# 📸 Mockups - EstampAI

Esta pasta contém as imagens de mockup para o sistema EstampAI.

## 📋 Estrutura de Arquivos

Para que o sistema funcione corretamente, organize os arquivos seguindo esta estrutura:

```
mockups/
├── geometrico-azul-branco.png
├── geometrico-preto-vermelho.png
├── geometrico-verde-amarelo.png
├── geometrico-outro.png
├── organico-azul-branco.png
├── organico-preto-vermelho.png
├── organico-verde-amarelo.png
├── organico-outro.png
├── abstrato-azul-branco.png
├── abstrato-preto-vermelho.png
├── abstrato-verde-amarelo.png
├── abstrato-outro.png
├── figurativo-azul-branco.png
├── figurativo-preto-vermelho.png
├── figurativo-verde-amarelo.png
└── figurativo-outro.png
```

## 🎨 Especificações das Imagens

### Dimensões Recomendadas
- **Largura**: 400-800px
- **Altura**: 500-1000px
- **Formato**: PNG (com transparência) ou JPG
- **Qualidade**: Alta resolução para melhor visualização

### Conteúdo das Imagens
- **Camiseta**: Modelo de camiseta com a estampa aplicada
- **Fundo**: Neutro ou transparente
- **Estampa**: Deve representar o estilo e cores selecionados
- **Qualidade**: Imagem nítida e bem iluminada

## 🔧 Como Atualizar

1. **Substitua as imagens**: Renomeie seus arquivos seguindo a estrutura acima
2. **Atualize o script.js**: Modifique o objeto `CONFIG.mockups`:

```javascript
const CONFIG = {
    mockups: {
        "Geométrico-Azul/Branco": "assets/mockups/geometrico-azul-branco.png",
        "Geométrico-Preto/Vermelho": "assets/mockups/geometrico-preto-vermelho.png",
        // ... continue para todas as combinações
    }
};
```

## 💡 Dicas para Criação

### Ferramentas Recomendadas
- **Photoshop**: Para edição profissional
- **GIMP**: Alternativa gratuita
- **Canva**: Para criação rápida
- **Figma**: Para design vetorial

### Dicas de Design
- Use modelos de camiseta consistentes
- Mantenha a mesma iluminação
- Aplique as estampas de forma realista
- Teste em diferentes tamanhos

## 🚀 Exemplos de URLs

Se preferir usar URLs externas:

```javascript
const CONFIG = {
    mockups: {
        "Geométrico-Azul/Branco": "https://exemplo.com/mockups/geometrico-azul-branco.png",
        "Orgânico-Preto/Vermelho": "https://exemplo.com/mockups/organico-preto-vermelho.png",
        // ...
    }
};
```

## 📱 Responsividade

As imagens serão redimensionadas automaticamente pelo CSS:
- **Desktop**: Tamanho original
- **Tablet**: 80% do tamanho original
- **Mobile**: 60% do tamanho original

## 🔍 Teste

Para testar se as imagens estão funcionando:
1. Abra o console do navegador (F12)
2. Verifique se não há erros 404
3. Teste todas as combinações de estilo/cor
4. Verifique se as imagens carregam rapidamente
