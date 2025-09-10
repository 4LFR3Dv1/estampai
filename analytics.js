/**
 * Sistema de Analytics para EstampAI
 * Coleta métricas de uso e conversão
 */

class Analytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.userId = this.getOrCreateUserId();
        this.startTime = Date.now();
        this.isEnabled = true;
    }

    // Gera ID único de sessão
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtém ou cria ID do usuário
    getOrCreateUserId() {
        let userId = localStorage.getItem('estampai_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('estampai_user_id', userId);
        }
        return userId;
    }

    // Registra evento
    track(event, data = {}) {
        if (!this.isEnabled) return;

        const eventData = {
            event,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.href,
            userAgent: navigator.userAgent,
            screen: {
                width: screen.width,
                height: screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.events.push(eventData);
        console.log('📊 Analytics:', event, data);

        // Envia para servidor (se configurado)
        this.sendToServer(eventData);
    }

    // Envia dados para servidor
    async sendToServer(eventData) {
        try {
            // Aqui você pode integrar com seu backend
            // Exemplo: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventData) })
            
            // Por enquanto, salva localmente
            this.saveToLocalStorage(eventData);
        } catch (error) {
            console.error('❌ Erro ao enviar analytics:', error);
        }
    }

    // Salva no localStorage
    saveToLocalStorage(eventData) {
        try {
            const stored = JSON.parse(localStorage.getItem('estampai_analytics') || '[]');
            stored.push(eventData);
            
            // Mantém apenas os últimos 100 eventos
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('estampai_analytics', JSON.stringify(stored));
        } catch (error) {
            console.error('❌ Erro ao salvar analytics:', error);
        }
    }

    // Eventos específicos
    trackEmbedLoaded() {
        this.track('embed_loaded', {
            loadTime: Date.now() - this.startTime
        });
    }

    trackMessageSent(message) {
        this.track('message_sent', {
            messageLength: message.length,
            hasContent: message.trim().length > 0
        });
    }

    trackStampGenerated(prompt, success) {
        this.track('stamp_generated', {
            prompt: prompt.substring(0, 100), // Primeiros 100 chars
            success,
            generationTime: Date.now() - this.startTime
        });
    }

    trackStampDownloaded() {
        this.track('stamp_downloaded');
    }

    trackViewChanged(view) {
        this.track('view_changed', { view });
    }

    trackError(error, context) {
        this.track('error', {
            error: error.message || error,
            context,
            stack: error.stack
        });
    }

    trackConversion(type, value) {
        this.track('conversion', { type, value });
    }

    // Obtém métricas da sessão
    getSessionMetrics() {
        const now = Date.now();
        const sessionDuration = now - this.startTime;
        
        const metrics = {
            sessionId: this.sessionId,
            userId: this.userId,
            duration: sessionDuration,
            events: this.events.length,
            messages: this.events.filter(e => e.event === 'message_sent').length,
            stampsGenerated: this.events.filter(e => e.event === 'stamp_generated').length,
            stampsDownloaded: this.events.filter(e => e.event === 'stamp_downloaded').length,
            errors: this.events.filter(e => e.event === 'error').length
        };

        return metrics;
    }

    // Obtém dados para exportação
    exportData() {
        return {
            session: this.getSessionMetrics(),
            events: this.events,
            timestamp: Date.now()
        };
    }

    // Limpa dados antigos
    cleanup() {
        try {
            const stored = JSON.parse(localStorage.getItem('estampai_analytics') || '[]');
            const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            const recent = stored.filter(event => event.timestamp > oneWeekAgo);
            localStorage.setItem('estampai_analytics', JSON.stringify(recent));
            
            console.log('🧹 Analytics cleanup: dados antigos removidos');
        } catch (error) {
            console.error('❌ Erro no cleanup de analytics:', error);
        }
    }
}

// Instância global
window.analytics = new Analytics();

// Inicializa automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.analytics.trackEmbedLoaded();
    
    // Cleanup semanal
    const lastCleanup = localStorage.getItem('estampai_last_cleanup');
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    if (!lastCleanup || parseInt(lastCleanup) < oneWeekAgo) {
        window.analytics.cleanup();
        localStorage.setItem('estampai_last_cleanup', Date.now().toString());
    }
});

export default Analytics;
