# 🤖 EstampAI - Chat com IA para Criação de Estampas

Sistema de **chat conversacional** onde o usuário conversa com uma IA que gera estampas PNG dinâmicas em tempo real.

## 🎯 O que é o EstampAI

O EstampAI é um **chat real com IA** onde você:
1. **Conversa** com a IA descrevendo o que quer
2. A **IA entende** sua solicitação e analisa
3. **Gera uma estampa PNG** única baseada na conversa
4. **Visualiza** no avatar 2D ou apenas a estampa
5. **Baixa** os arquivos PNG gerados

## ✨ Funcionalidades Principais

### 💬 Chat Conversacional
- **Interface de chat real** com mensagens do usuário e IA
- **IA inteligente** que analisa descrições em linguagem natural
- **Sugestões rápidas** para facilitar o uso
- **Histórico salvo** no localStorage
- **Exportação** do chat completo

### 🎨 Geração de Estampas PNG
- **4 estilos**: Geométrico, Orgânico, Abstrato, Figurativo
- **Detecção automática** de cores mencionadas
- **Padrões dinâmicos** baseados na descrição
- **Intensidade ajustável** (pastel, vibrante, etc.)
- **Geração em tempo real** com Canvas HTML5

### 👤 Visualização
- **Avatar 2D**: Estampa aplicada em um avatar
- **Apenas Estampa**: PNG isolado da estampa
- **Download**: Múltiplas opções de download
- **Informações**: Dados da criação em JSON

### 📱 Interface Moderna
- **Design responsivo** para desktop e mobile
- **Chat em tempo real** com animações
- **Loading states** durante geração
- **Navegação intuitiva** entre visualizações

## 🚀 Como Usar

### 1. Inicie uma Conversa
```
Usuário: "Quero uma estampa floral com cores pastel"
IA: "Entendi! Vou criar uma estampa baseada na sua descrição..."
```

### 2. A IA Analisa e Gera
- Detecta **estilo**: "floral" → Orgânico
- Detecta **cores**: "pastel" → Intensidade reduzida
- Gera **padrão**: Flores com cores suaves
- Cria **PNG** em tempo real

### 3. Visualize e Baixe
- Veja no **avatar 2D** ou **apenas a estampa**
- **Baixe** o PNG gerado
- **Regenere** com variações
- **Exporte** informações da criação

## 🎨 Exemplos de Conversas

### Exemplo 1: Estampa Geométrica
```
Usuário: "Crie uma estampa geométrica com triângulos azuis e brancos"
IA: "Perfeito! Vou criar uma estampa geométrica com triângulos nas cores azul e branco..."
```

### Exemplo 2: Estampa Abstrata
```
Usuário: "Quero algo abstrato e vibrante"
IA: "Entendi! Vou criar uma estampa abstrata com cores vibrantes..."
```

### Exemplo 3: Estampa Figurativa
```
Usuário: "Faça uma estampa com estrelas em preto e vermelho"
IA: "Ótimo! Vou criar uma estampa figurativa com estrelas nas cores preto e vermelho..."
```

## 🛠 Instalação e Uso

### Teste Local
```bash
# Abra index.html em um navegador
# OU use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Deploy Online
- **Netlify**: Arraste a pasta para netlify.com
- **Vercel**: Conecte repositório GitHub
- **GitHub Pages**: Ative nas configurações
- **Render**: Deploy automático via GitHub

## 📁 Estrutura do Projeto

```
EstampAI/
├── index.html          # Interface principal do chat
├── styles.css          # Estilos do chat e visualizações
├── script.js           # Lógica do chat e geração de estampas
├── config.js           # Configurações centralizadas
├── render.yaml         # Configuração para deploy no Render
├── package.json        # Metadados do projeto
├── README.md           # Esta documentação
├── embed/              # Sistema de embed para Framer
└── assets/             # Recursos (imagens, ícones, mockups)
```

## 🎯 Como Funciona a IA

### Análise de Linguagem Natural
A IA analisa sua mensagem e detecta:

**Estilos:**
- "floral", "flor", "orgânico" → Padrão de flores
- "geométrico", "triângulo", "quadrado" → Padrão geométrico
- "abstrato", "abstrata" → Padrão abstrato
- "figurativo", "figura", "desenho" → Padrão figurativo

**Cores:**
- "azul" → #1A237E
- "vermelho", "red" → #FF0000
- "verde" → #4CAF50
- "preto", "black" → #000000
- "branco", "white" → #FFFFFF
- "amarelo", "yellow" → #FFEB3B

**Intensidade:**
- "pastel" → 0.5 (cores suaves)
- "vibrante", "forte" → 1.0 (cores intensas)
- Padrão → 0.8

### Geração de Padrões
Cada estilo tem padrões únicos:

- **Geométrico**: Triângulos, quadrados, formas regulares
- **Orgânico**: Flores, formas naturais, curvas
- **Abstrato**: Linhas curvas, círculos aleatórios
- **Figurativo**: Estrelas, figuras reconhecíveis

## 🎨 Personalização

### Adicionar Novos Estilos
1. Edite a função `analyzeUserRequest()` em `script.js`
2. Adicione detecção de palavras-chave
3. Crie função de desenho do padrão
4. Adicione ao switch em `drawPattern()`

### Adicionar Novas Cores
1. Edite a seção de detecção de cores
2. Adicione mapeamento de cores
3. Teste com diferentes combinações

### Modificar Padrões
1. Edite as funções `draw*Pattern()` em `script.js`
2. Use Canvas API para criar novos padrões
3. Ajuste parâmetros de tamanho e posição

## 📱 Responsividade

O sistema funciona em:
- **Desktop**: Experiência completa com chat e visualizações lado a lado
- **Tablet**: Layout adaptado com chat em cima
- **Mobile**: Interface otimizada para touch

## 🔧 Funcionalidades Técnicas

### Canvas HTML5
- **Geração de PNG** em tempo real
- **Avatar 2D** com estampa aplicada
- **Estampa isolada** para download
- **Qualidade alta** para impressão

### LocalStorage
- **Histórico do chat** salvo automaticamente
- **Persistência** entre sessões
- **Exportação** de dados
- **Limpeza** opcional

### Sistema de Download
- **Avatar completo** (PNG)
- **Apenas estampa** (PNG)
- **Informações** (JSON)
- **Chat completo** (JSON)

## 🎯 Casos de Uso

### Para Designers
- **Prototipagem rápida** de estampas
- **Exploração de ideias** através de conversa
- **Geração de referências** visuais
- **Teste de conceitos** antes da produção

### Para Clientes
- **Comunicação visual** de ideias
- **Visualização** de estampas em avatar
- **Download** para uso pessoal
- **Iteração** através de conversa

### Para Desenvolvedores
- **Base para IA** mais avançada
- **Integração** com APIs de IA
- **Sistema de chat** conversacional
- **Geração de imagens** dinâmica

## 🚀 Próximos Passos

### Melhorias Possíveis
1. **IA mais avançada** com APIs reais (OpenAI, etc.)
2. **Mais estilos** de estampa
3. **Avatar 3D** com Three.js
4. **Integração** com sistemas de impressão
5. **Comunidade** de estampas compartilhadas

### Integrações
1. **Stripe/PayPal** para compra de estampas
2. **APIs de IA** para análise mais sofisticada
3. **Sistemas de impressão** para produção
4. **Redes sociais** para compartilhamento

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Teste em diferentes navegadores
3. Verifique se JavaScript está habilitado
4. Teste em servidor local se necessário

## 📄 Licença

Este projeto foi desenvolvido para o EstampAI por Renan Melo.
Use livremente para fins educacionais e comerciais.

---

**Desenvolvido com ❤️ por Renan Melo**

*Sistema de chat conversacional com IA para criação de estampas PNG dinâmicas.*