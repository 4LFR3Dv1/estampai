# 🔒 Configuração HTTPS Local para EstampAI

## Problema CORS
O navegador bloqueia requisições de `http://localhost` para APIs externas por questões de segurança. Para resolver isso, você precisa usar HTTPS.

## Soluções

### 1. 🚀 Solução Rápida - mkcert (Recomendado)

```bash
# Instala mkcert
brew install mkcert  # macOS
# ou
choco install mkcert  # Windows
# ou
sudo apt install mkcert  # Linux

# Cria certificado local
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Renomeia os arquivos
mv localhost+2.pem server.crt
mv localhost+2-key.pem server.key
```

### 2. 🔧 Servidor HTTPS com Python

```python
#!/usr/bin/env python3
import http.server
import ssl
import socketserver

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

PORT = 8443
with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
    httpd.socket = ssl.wrap_socket(httpd.socket, 
                                   certfile="server.crt", 
                                   keyfile="server.key", 
                                   server_side=True)
    print(f"🔒 Servidor HTTPS em https://localhost:{PORT}")
    httpd.serve_forever()
```

### 3. 🌐 Deploy em Produção

Para produção, use um serviço como:
- **Vercel** (gratuito)
- **Netlify** (gratuito)
- **GitHub Pages** (gratuito)
- **Firebase Hosting** (gratuito)

## Configuração para Framer

### Embed Code para Produção:
```html
<iframe 
    src="https://seu-dominio.com/embed/estampai-embed.html"
    width="100%" 
    height="600" 
    frameborder="0"
    allow="clipboard-write"
    title="EstampAI - Gerador de Estampas"
></iframe>
```

### Variáveis de Ambiente:
```javascript
const CONFIG = {
    apiKey: process.env.OPENAI_API_KEY,
    environment: process.env.NODE_ENV,
    domain: process.env.DOMAIN
};
```

## Teste Local

1. **HTTP (com limitações):**
   ```bash
   python3 cors-server.py
   # Acesse: http://localhost:8001
   ```

2. **HTTPS (recomendado):**
   ```bash
   python3 https-server.py
   # Acesse: https://localhost:8443
   ```

## Notas Importantes

- ✅ **Desenvolvimento local:** Use HTTPS com certificado local
- ✅ **Produção:** Use domínio com SSL válido
- ✅ **Framer:** Funciona perfeitamente com HTTPS
- ⚠️ **HTTP local:** Limitado por CORS do navegador
