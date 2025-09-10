/**
 * Otimizador de Custos de API para EstampAI
 * Reduz chamadas desnecessárias e otimiza prompts
 */

class APIOptimizer {
    constructor() {
        this.requestQueue = [];
        this.isProcessing = false;
        this.debounceDelay = 1000;
        this.maxRetries = 3;
        this.retryDelay = 2000;
    }

    // Debounce para evitar múltiplas chamadas
    debounce(func, delay = this.debounceDelay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Otimiza prompt para reduzir tokens
    optimizePrompt(prompt) {
        // Remove palavras desnecessárias
        const optimized = prompt
            .replace(/\b(um|uma|o|a|de|da|do|em|na|no|para|com|por|sobre|entre|através|durante|após|antes|depois|quando|onde|como|porque|que|qual|quais|quem|cujo|cuja)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        // Limita tamanho
        const maxLength = 500;
        return optimized.length > maxLength 
            ? optimized.substring(0, maxLength) + '...'
            : optimized;
    }

    // Compressa histórico de conversa
    compressConversationHistory(history, maxMessages = 5) {
        if (history.length <= maxMessages) {
            return history;
        }

        // Mantém as primeiras e últimas mensagens
        const compressed = [
            ...history.slice(0, 2), // Primeiras 2
            ...history.slice(-3)    // Últimas 3
        ];

        return compressed;
    }

    // Sistema de retry com backoff exponencial
    async retryRequest(requestFn, maxRetries = this.maxRetries) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await requestFn();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }

                const delay = this.retryDelay * Math.pow(2, attempt - 1);
                console.log(`🔄 Tentativa ${attempt} falhou, tentando novamente em ${delay}ms`);
                await this.sleep(delay);
            }
        }
    }

    // Sleep utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Rate limiting por usuário
    createRateLimiter(maxRequests = 10, windowMs = 60000) {
        const requests = new Map();

        return (userId) => {
            const now = Date.now();
            const userRequests = requests.get(userId) || [];

            // Remove requests antigas
            const validRequests = userRequests.filter(time => now - time < windowMs);

            if (validRequests.length >= maxRequests) {
                throw new Error('Rate limit excedido');
            }

            validRequests.push(now);
            requests.set(userId, validRequests);
        };
    }

    // Cache de respostas de chat
    createChatCache(maxSize = 100) {
        const cache = new Map();

        return {
            get: (key) => cache.get(key),
            set: (key, value) => {
                if (cache.size >= maxSize) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                }
                cache.set(key, value);
            },
            clear: () => cache.clear()
        };
    }
}

// Instância global
window.apiOptimizer = new APIOptimizer();

export default APIOptimizer;
