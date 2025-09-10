#!/usr/bin/env python3
"""
Servidor HTTPS com CORS headers para EstampAI Embed
Resolve problemas de CORS para desenvolvimento local
"""

import http.server
import ssl
import socketserver
import os
import sys

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
        print(f"🔒 {self.address_string()} - {format % args}")

def create_self_signed_cert():
    """Cria certificado auto-assinado para desenvolvimento"""
    try:
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        from datetime import datetime, timedelta
        
        # Gera chave privada
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # Cria certificado
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "BR"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "São Paulo"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "São Paulo"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "EstampAI"),
            x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.utcnow()
        ).not_valid_after(
            datetime.utcnow() + timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.IPAddress("127.0.0.1"),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # Salva certificado
        with open("server.crt", "wb") as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        # Salva chave privada
        with open("server.key", "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        print("✅ Certificado auto-assinado criado")
        return True
        
    except ImportError:
        print("⚠️ cryptography não instalado. Use: pip install cryptography")
        return False
    except Exception as e:
        print(f"❌ Erro ao criar certificado: {e}")
        return False

def run_https_server(port=8443):
    """Inicia o servidor HTTPS com CORS headers"""
    
    # Verifica se os certificados existem
    if not os.path.exists("server.crt") or not os.path.exists("server.key"):
        print("🔐 Criando certificado auto-assinado...")
        if not create_self_signed_cert():
            print("❌ Não foi possível criar certificado. Use HTTP ou instale cryptography")
            return
    
    try:
        with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
            # Configura SSL
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            context.load_cert_chain("server.crt", "server.key")
            httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
            
            print(f"🔒 Servidor HTTPS EstampAI iniciado em https://localhost:{port}")
            print(f"📁 Servindo arquivos de: {os.getcwd()}")
            print(f"🔧 CORS headers habilitados")
            print(f"⚠️  Certificado auto-assinado - aceite o aviso do navegador")
            print(f"⏹️  Pressione Ctrl+C para parar")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Porta {port} já está em uso. Tentando porta {port + 1}...")
            run_https_server(port + 1)
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado pelo usuário")
        sys.exit(0)

if __name__ == "__main__":
    # Pega a porta dos argumentos ou usa 8443 como padrão
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8443
    run_https_server(port)
