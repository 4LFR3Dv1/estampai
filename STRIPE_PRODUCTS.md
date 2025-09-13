# 🎯 **Produtos Configurados no Stripe - EstampAI**

## **📋 Produtos Disponíveis**

### **1. 🏆 Premium - EstampAI**
- **ID do Produto:** `prod_T35TiyH5UIRvy8`
- **Nome:** Premium - EstampAI
- **Descrição:** Acesso premium mensal
- **Preço:** R$ 29,90
- **Tipo:** Pagamento único
- **Benefícios:**
  - Gerações ilimitadas
  - Acesso a todos os estilos
  - Suporte prioritário
  - Sem limite de tempo

### **2. ⚡ Dia Ilimitado - EstampAI**
- **ID do Produto:** `prod_daily_unlimited` (a ser criado)
- **Nome:** Dia Ilimitado - EstampAI
- **Descrição:** Acesso ilimitado por 24 horas
- **Preço:** R$ 9,90
- **Tipo:** Pagamento único
- **Benefícios:**
  - Gerações ilimitadas por 24h
  - Acesso a todos os estilos
  - Ideal para testes

## **🔧 Configuração no Stripe Dashboard**

### **1. Criar Produto "Dia Ilimitado":**
1. Acesse [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Clique em **Add product**
3. Configure:
   - **Name:** Dia Ilimitado - EstampAI
   - **Description:** Acesso ilimitado por 24 horas
   - **Pricing:** R$ 9,90 (one-time)
4. Salve e copie o **Product ID**

### **2. Atualizar Código:**
Após criar o produto, atualize o `server.js`:
```javascript
productId: planType === 'premium' ? 'prod_T35TiyH5UIRvy8' : 'prod_SEU_ID_DIA_ILIMITADO'
```

## **📊 Metadados dos Produtos**

### **Premium:**
```json
{
  "planType": "premium",
  "productId": "prod_T35TiyH5UIRvy8",
  "price": 2990,
  "currency": "BRL",
  "duration": "unlimited"
}
```

### **Dia Ilimitado:**
```json
{
  "planType": "daily_unlimited",
  "productId": "prod_daily_unlimited",
  "price": 990,
  "currency": "BRL",
  "duration": "24h"
}
```

## **🎯 Próximos Passos**

1. **Criar produto "Dia Ilimitado"** no Stripe Dashboard
2. **Atualizar código** com o novo Product ID
3. **Testar pagamentos** com ambos os produtos
4. **Configurar webhooks** para confirmação automática

---

**✅ Produto Premium configurado e funcionando!** 🚀
