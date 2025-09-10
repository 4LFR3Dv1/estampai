#!/usr/bin/env python3
"""
Servidor HTTP com CORS headers para EstampAI Embed
Resolve problemas de CORS para desenvolvimento local
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adiciona headers CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Max-Age', '86400')
        
        # Headers de segurança
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # Cache headers para assets
        if self.path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg')):
            self.send_header('Cache-Control', 'public, max-age=3600')
        
        super().end_headers()

    def do_OPTIONS(self):
        # Responde a preflight requests
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        # Log personalizado
        print(f"🌐 {self.address_string()} - {format % args}")

def run_server(port=8001):
    """Inicia o servidor com CORS headers"""
    
    # Verifica se a porta está disponível
    try:
        with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
            print(f"🚀 Servidor EstampAI iniciado em http://localhost:{port}")
            print(f"📁 Servindo arquivos de: {os.getcwd()}")
            print(f"🔧 CORS headers habilitados")
            print(f"⏹️  Pressione Ctrl+C para parar")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Porta {port} já está em uso. Tentando porta {port + 1}...")
            run_server(port + 1)
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado pelo usuário")
        sys.exit(0)

if __name__ == "__main__":
    # Pega a porta dos argumentos ou usa 8001 como padrão
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    run_server(port)
