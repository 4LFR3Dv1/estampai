/**
 * Sistema de Lead Capture para EstampAI
 * Captura informações de contato e gera leads qualificados
 */

class LeadCapture {
    constructor() {
        this.leads = [];
        this.isModalOpen = false;
        this.triggerEvents = ['stamp_downloaded', 'stamp_generated'];
        this.requiredFields = ['name', 'email'];
        this.optionalFields = ['phone', 'company', 'message'];
    }

    // Verifica se deve mostrar o modal de lead capture
    shouldShowLeadCapture(event) {
        // Mostra após 2 estampas geradas ou 1 download
        const stampsGenerated = this.getEventCount('stamp_generated');
        const stampsDownloaded = this.getEventCount('stamp_downloaded');
        
        return stampsGenerated >= 2 || stampsDownloaded >= 1;
    }

    // Conta eventos específicos
    getEventCount(eventType) {
        if (!window.analytics) return 0;
        
        const events = window.analytics.events || [];
        return events.filter(e => e.event === eventType).length;
    }

    // Mostra modal de lead capture
    showLeadCaptureModal() {
        if (this.isModalOpen) return;
        
        this.isModalOpen = true;
        this.createModal();
    }

    // Cria modal de lead capture
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'leadCaptureModal';
        modal.className = 'lead-modal-overlay';
        modal.innerHTML = `
            <div class="lead-modal">
                <div class="lead-modal-header">
                    <h3>🎨 Gostou das suas estampas?</h3>
                    <p>Deixe seus dados para receber mais estampas personalizadas!</p>
                    <button class="lead-modal-close" onclick="leadCapture.closeModal()">×</button>
                </div>
                
                <form class="lead-form" onsubmit="leadCapture.submitLead(event)">
                    <div class="form-group">
                        <label for="leadName">Nome *</label>
                        <input type="text" id="leadName" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="leadEmail">Email *</label>
                        <input type="email" id="leadEmail" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="leadPhone">Telefone</label>
                        <input type="tel" id="leadPhone" name="phone">
                    </div>
                    
                    <div class="form-group">
                        <label for="leadCompany">Empresa</label>
                        <input type="text" id="leadCompany" name="company">
                    </div>
                    
                    <div class="form-group">
                        <label for="leadMessage">Mensagem</label>
                        <textarea id="leadMessage" name="message" rows="3" placeholder="Conte-me sobre seu projeto..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="leadCapture.closeModal()">
                            Agora não
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Enviar dados
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Adiciona estilos
        this.addModalStyles();
        
        // Adiciona ao DOM
        document.body.appendChild(modal);
        
        // Foco no primeiro campo
        setTimeout(() => {
            document.getElementById('leadName').focus();
        }, 100);
    }

    // Adiciona estilos do modal
    addModalStyles() {
        if (document.getElementById('leadModalStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'leadModalStyles';
        styles.textContent = `
            .lead-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .lead-modal {
                background: white;
                border-radius: 16px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: slideIn 0.3s ease;
            }
            
            .lead-modal-header {
                text-align: center;
                margin-bottom: 24px;
                position: relative;
            }
            
            .lead-modal-header h3 {
                color: #1A237E;
                font-size: 1.5rem;
                margin-bottom: 8px;
            }
            
            .lead-modal-header p {
                color: #666;
                font-size: 1rem;
            }
            
            .lead-modal-close {
                position: absolute;
                top: -10px;
                right: -10px;
                background: #f0f0f0;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .lead-modal-close:hover {
                background: #e0e0e0;
            }
            
            .form-group {
                margin-bottom: 16px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 600;
                color: #333;
                font-size: 14px;
            }
            
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                font-family: inherit;
                transition: border-color 0.2s ease;
            }
            
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #1A237E;
                box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
            }
            
            .form-actions {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            
            .form-actions .btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .form-actions .btn-primary {
                background: #1A237E;
                color: white;
            }
            
            .form-actions .btn-primary:hover {
                background: #0d47a1;
            }
            
            .form-actions .btn-secondary {
                background: #f0f0f0;
                color: #333;
            }
            
            .form-actions .btn-secondary:hover {
                background: #e0e0e0;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @media (max-width: 480px) {
                .lead-modal {
                    padding: 20px;
                    margin: 20px;
                }
                
                .lead-modal-header h3 {
                    font-size: 1.3rem;
                }
                
                .form-actions {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Fecha modal
    closeModal() {
        const modal = document.getElementById('leadCaptureModal');
        if (modal) {
            modal.remove();
        }
        this.isModalOpen = false;
    }

    // Submete lead
    async submitLead(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const lead = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            userId: window.analytics ? window.analytics.userId : null,
            sessionId: window.analytics ? window.analytics.sessionId : null,
            stampsGenerated: this.getEventCount('stamp_generated'),
            stampsDownloaded: this.getEventCount('stamp_downloaded')
        };

        try {
            // Salva localmente
            this.saveLead(lead);
            
            // Envia para servidor (se configurado)
            await this.sendLeadToServer(lead);
            
            // Analytics
            if (window.analytics) {
                window.analytics.trackConversion('lead_captured', 1);
            }
            
            // Mostra sucesso
            this.showSuccessMessage();
            
            // Fecha modal
            setTimeout(() => {
                this.closeModal();
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao salvar lead:', error);
            this.showErrorMessage();
        }
    }

    // Salva lead localmente
    saveLead(lead) {
        try {
            const leads = JSON.parse(localStorage.getItem('estampai_leads') || '[]');
            leads.push(lead);
            localStorage.setItem('estampai_leads', JSON.stringify(leads));
            console.log('✅ Lead salvo localmente:', lead);
        } catch (error) {
            console.error('❌ Erro ao salvar lead localmente:', error);
        }
    }

    // Envia lead para servidor
    async sendLeadToServer(lead) {
        try {
            // Aqui você pode integrar com seu backend
            // Exemplo: fetch('/api/leads', { method: 'POST', body: JSON.stringify(lead) })
            
            console.log('📤 Lead enviado para servidor:', lead);
        } catch (error) {
            console.error('❌ Erro ao enviar lead para servidor:', error);
            throw error;
        }
    }

    // Mostra mensagem de sucesso
    showSuccessMessage() {
        const modal = document.querySelector('.lead-modal');
        if (modal) {
            modal.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                    <h3 style="color: #1A237E; margin-bottom: 8px;">Obrigado!</h3>
                    <p style="color: #666;">Seus dados foram enviados com sucesso. Entraremos em contato em breve!</p>
                </div>
            `;
        }
    }

    // Mostra mensagem de erro
    showErrorMessage() {
        const modal = document.querySelector('.lead-modal');
        if (modal) {
            modal.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                    <h3 style="color: #c62828; margin-bottom: 8px;">Ops!</h3>
                    <p style="color: #666;">Houve um erro ao enviar seus dados. Tente novamente.</p>
                    <button class="btn btn-primary" onclick="leadCapture.closeModal()" style="margin-top: 16px;">
                        Fechar
                    </button>
                </div>
            `;
        }
    }

    // Obtém leads salvos
    getLeads() {
        try {
            return JSON.parse(localStorage.getItem('estampai_leads') || '[]');
        } catch (error) {
            console.error('❌ Erro ao obter leads:', error);
            return [];
        }
    }

    // Limpa leads antigos
    cleanupLeads() {
        try {
            const leads = this.getLeads();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            
            const recentLeads = leads.filter(lead => 
                new Date(lead.timestamp) > oneMonthAgo
            );
            
            localStorage.setItem('estampai_leads', JSON.stringify(recentLeads));
            console.log('🧹 Leads antigos removidos');
        } catch (error) {
            console.error('❌ Erro ao limpar leads:', error);
        }
    }
}

// Instância global
window.leadCapture = new LeadCapture();

// Integração com analytics
document.addEventListener('DOMContentLoaded', () => {
    // Limpa leads antigos
    window.leadCapture.cleanupLeads();
    
    // Monitora eventos para trigger
    if (window.analytics) {
        const originalTrack = window.analytics.track;
        window.analytics.track = function(event, data) {
            originalTrack.call(this, event, data);
            
            // Verifica se deve mostrar lead capture
            if (window.leadCapture.shouldShowLeadCapture(event)) {
                setTimeout(() => {
                    window.leadCapture.showLeadCaptureModal();
                }, 1000);
            }
        };
    }
});

// Exportação removida para compatibilidade com script tags
window.LeadCapture = LeadCapture;
