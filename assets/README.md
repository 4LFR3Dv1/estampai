# Assets do EstampAI

Esta pasta contém todos os recursos visuais do projeto EstampAI.

## Estrutura de Pastas

### `/mockups/`
Contém as imagens dos mockups de camisetas com diferentes estampas.
- **Formato recomendado**: PNG com fundo transparente
- **Dimensões**: 400x500px (proporção 4:5)
- **Nomenclatura**: `[estilo]-[cor].png`
  - Exemplo: `geometrico-azul-branco.png`

### `/icons/`
Contém ícones e elementos gráficos menores.
- **Formato**: SVG ou PNG
- **Dimensões**: 24x24px, 32x32px, 48x48px

### `/patterns/`
Contém padrões de estampas em alta resolução.
- **Formato**: PNG ou SVG
- **Dimensões**: 1000x1000px (para qualidade)

## Como Adicionar Novos Mockups

1. Crie uma imagem de 400x500px com fundo transparente
2. Nomeie seguindo o padrão: `[estilo]-[cor].png`
3. Adicione no arquivo `script.js` na seção `CONFIG.mockups`
4. Teste a integração

## Estilos Disponíveis

- **Geométrico**: Formas precisas e simétricas
- **Orgânico**: Formas fluidas e naturais  
- **Abstrato**: Arte não representacional
- **Figurativo**: Representações de objetos reais

## Paletas de Cores

- **Azul/Branco**: #1A237E, #FFFFFF
- **Preto/Vermelho**: #000000, #FF0000
- **Verde/Amarelo**: #4CAF50, #FFEB3B
- **Outro**: #9C27B0, #FF9800

## Dicas para Criação de Mockups

1. Use um template de camiseta consistente
2. Mantenha a estampa centralizada
3. Considere diferentes tamanhos de estampa
4. Teste em diferentes fundos
5. Otimize para web (compressão PNG)
