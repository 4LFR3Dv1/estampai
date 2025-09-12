/**
 * Sistema de Cache Persistente para EstampAI
 * Usa IndexedDB para armazenar estampas e reduzir custos de API
 */

class StampCacheManager {
    constructor() {
        this.dbName = 'EstampAICache';
        this.dbVersion = 1;
        this.db = null;
        this.cacheSize = 50; // Máximo de estampas em cache
        this.cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('❌ Erro ao abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ Cache IndexedDB inicializado');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store para estampas
                if (!db.objectStoreNames.contains('stamps')) {
                    const stampStore = db.createObjectStore('stamps', { keyPath: 'id' });
                    stampStore.createIndex('prompt', 'prompt', { unique: false });
                    stampStore.createIndex('timestamp', 'timestamp', { unique: false });
                    stampStore.createIndex('usage', 'usage', { unique: false });
                }

                // Store para configurações
                if (!db.objectStoreNames.contains('config')) {
                    db.createObjectStore('config', { keyPath: 'key' });
                }

                console.log('✅ Estrutura do cache criada');
            };
        });
    }

    async saveStamp(prompt, imageUrl, metadata = {}) {
        if (!this.db) {
            console.warn('⚠️ Cache não inicializado');
            return false;
        }

        try {
            const transaction = this.db.transaction(['stamps'], 'readwrite');
            const store = transaction.objectStore('stamps');

            const stampData = {
                id: this.generateId(prompt),
                prompt: prompt,
                imageUrl: imageUrl,
                timestamp: Date.now(),
                usage: 1,
                metadata: metadata,
                size: this.estimateImageSize(imageUrl)
            };

            await store.put(stampData);
            
            // Limpa cache se necessário
            await this.cleanupCache();
            
            console.log('✅ Estampa salva no cache:', stampData.id);
            return true;

        } catch (error) {
            console.error('❌ Erro ao salvar estampa:', error);
            return false;
        }
    }

    async getCachedStamp(prompt) {
        if (!this.db) {
            console.warn('⚠️ Cache não inicializado');
            return null;
        }

        try {
            const transaction = this.db.transaction(['stamps'], 'readonly');
            const store = transaction.objectStore('stamps');
            const index = store.index('prompt');

            const request = index.getAll(prompt);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const results = request.result;
                    
                    if (results.length === 0) {
                        resolve(null);
                        return;
                    }

                    // Pega a estampa mais recente
                    const latestStamp = results.reduce((latest, current) => 
                        current.timestamp > latest.timestamp ? current : latest
                    );

                    // Verifica se não expirou
                    if (Date.now() - latestStamp.timestamp > this.cacheExpiry) {
                        console.log('⏰ Estampa expirada, removendo do cache');
                        this.removeStamp(latestStamp.id);
                        resolve(null);
                        return;
                    }

                    // Atualiza contador de uso
                    this.updateUsage(latestStamp.id);

                    console.log('🎯 Estampa encontrada no cache:', latestStamp.id);
                    resolve(latestStamp);

                };

                request.onerror = () => {
                    console.error('❌ Erro ao buscar estampa:', request.error);
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro ao buscar estampa:', error);
            return null;
        }
    }

    async updateUsage(stampId) {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(['stamps'], 'readwrite');
            const store = transaction.objectStore('stamps');

            const request = store.get(stampId);
            
            request.onsuccess = () => {
                const stamp = request.result;
                if (stamp) {
                    stamp.usage += 1;
                    stamp.lastUsed = Date.now();
                    store.put(stamp);
                }
            };

        } catch (error) {
            console.error('❌ Erro ao atualizar uso:', error);
        }
    }

    async removeStamp(stampId) {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(['stamps'], 'readwrite');
            const store = transaction.objectStore('stamps');
            store.delete(stampId);
            console.log('🗑️ Estampa removida do cache:', stampId);
        } catch (error) {
            console.error('❌ Erro ao remover estampa:', error);
        }
    }

    async cleanupCache() {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(['stamps'], 'readwrite');
            const store = transaction.objectStore('stamps');
            const request = store.getAll();

            request.onsuccess = () => {
                const stamps = request.result;
                
                if (stamps.length <= this.cacheSize) {
                    return; // Cache não está cheio
                }

                // Ordena por uso e timestamp
                stamps.sort((a, b) => {
                    // Primeiro por uso (menos usado primeiro)
                    if (a.usage !== b.usage) {
                        return a.usage - b.usage;
                    }
                    // Depois por timestamp (mais antigo primeiro)
                    return a.timestamp - b.timestamp;
                });

                // Remove as estampas menos usadas
                const toRemove = stamps.slice(0, stamps.length - this.cacheSize);
                
                toRemove.forEach(stamp => {
                    store.delete(stamp.id);
                    console.log('🧹 Removendo estampa do cache:', stamp.id);
                });

                console.log(`🧹 Cache limpo: ${toRemove.length} estampas removidas`);
            };

        } catch (error) {
            console.error('❌ Erro ao limpar cache:', error);
        }
    }

    async getCacheStats() {
        if (!this.db) {
            return { total: 0, size: 0, oldest: null, newest: null };
        }

        try {
            const transaction = this.db.transaction(['stamps'], 'readonly');
            const store = transaction.objectStore('stamps');
            const request = store.getAll();

            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const stamps = request.result;
                    
                    const stats = {
                        total: stamps.length,
                        size: stamps.reduce((sum, stamp) => sum + (stamp.size || 0), 0),
                        oldest: stamps.length > 0 ? Math.min(...stamps.map(s => s.timestamp)) : null,
                        newest: stamps.length > 0 ? Math.max(...stamps.map(s => s.timestamp)) : null,
                        totalUsage: stamps.reduce((sum, stamp) => sum + stamp.usage, 0)
                    };

                    resolve(stats);
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro ao obter estatísticas:', error);
            return { total: 0, size: 0, oldest: null, newest: null };
        }
    }

    async clearCache() {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(['stamps'], 'readwrite');
            const store = transaction.objectStore('stamps');
            store.clear();
            console.log('🗑️ Cache completamente limpo');
        } catch (error) {
            console.error('❌ Erro ao limpar cache:', error);
        }
    }

    generateId(prompt) {
        // Gera ID baseado no hash do prompt
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            const char = prompt.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converte para 32bit
        }
        return `stamp_${Math.abs(hash)}`;
    }

    estimateImageSize(imageUrl) {
        // Estimativa baseada no tipo de URL
        if (imageUrl.includes('dall-e-3')) {
            return 1024 * 1024; // ~1MB para DALL-E 3
        }
        return 500 * 1024; // ~500KB padrão
    }

    // Método para buscar estampas similares
    async findSimilarStamps(prompt, threshold = 0.7) {
        if (!this.db) return [];

        try {
            const transaction = this.db.transaction(['stamps'], 'readonly');
            const store = transaction.objectStore('stamps');
            const request = store.getAll();

            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const stamps = request.result;
                    const similar = [];

                    stamps.forEach(stamp => {
                        const similarity = this.calculateSimilarity(prompt, stamp.prompt);
                        if (similarity >= threshold) {
                            similar.push({
                                ...stamp,
                                similarity: similarity
                            });
                        }
                    });

                    // Ordena por similaridade
                    similar.sort((a, b) => b.similarity - a.similarity);
                    resolve(similar);
                };

                request.onerror = () => {
                    reject(request.error);
                };
            });

        } catch (error) {
            console.error('❌ Erro ao buscar estampas similares:', error);
            return [];
        }
    }

    calculateSimilarity(prompt1, prompt2) {
        // Algoritmo simples de similaridade baseado em palavras comuns
        const words1 = prompt1.toLowerCase().split(/\s+/);
        const words2 = prompt2.toLowerCase().split(/\s+/);
        
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }
}

// Instância global do cache
window.stampCache = new StampCacheManager();

// Inicializa automaticamente
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.stampCache.init();
        console.log('✅ Sistema de cache inicializado');
    } catch (error) {
        console.warn('⚠️ Cache não disponível, funcionando sem cache');
    }
});

// Exportação removida para compatibilidade com script tags
window.StampCacheManager = StampCacheManager;
