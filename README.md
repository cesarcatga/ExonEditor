# ExonEditor Web

App completo de anotação de éxons rodando no browser.

## Arquitetura

```
frontend/  → React → Vercel
backend/   → FastAPI → Render
```

---

## 1. Deploy do Backend (Render)

1. Crie uma conta em [render.com](https://render.com)
2. **New → Web Service**
3. Conecte seu repositório GitHub (faça push da pasta `backend/`)
4. Configure:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Clique em **Deploy**
6. Anote a URL gerada (ex: `https://exoneditor-api.onrender.com`)

> ⚠️ No plano gratuito do Render, o serviço "hiberna" após 15min de inatividade.
> A primeira requisição pode demorar ~30s para acordar.

---

## 2. Deploy do Frontend (Vercel)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. **New Project → Import** do GitHub (pasta `frontend/`)
3. Em **Environment Variables**, adicione:
   ```
   REACT_APP_API_URL = https://sua-api.onrender.com
   ```
4. Clique em **Deploy**

---

## 3. Desenvolvimento local

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Acesse: http://localhost:8000/docs

### Frontend
```bash
cd frontend
cp .env.example .env
# Edite .env com REACT_APP_API_URL=http://localhost:8000
npm install
npm start
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/buscar?termo=ALB&organismo=Homo+sapiens` | Busca genes no NCBI |
| POST | `/carregar` | Carrega e parseia GenBank (2 passos) |
| POST | `/analisar-codons` | Verifica primeiros aminoácidos |
| POST | `/localizar-codon` | Localiza códon por nº do aminoácido |
| POST | `/stop-codon` | Encontra o códon de parada |
| POST | `/gerar-documento` | Gera e retorna o .docx para download |

---

## Funcionalidades

- ✅ Busca por nome, accession ou ID do NCBI
- ✅ Carregamento automático em 2 passos (detecta região dos éxons)
- ✅ Barra visual proporcional do gene
- ✅ Proteína nascente e madura
- ✅ Análise dos primeiros códons (automática via preprotein)
- ✅ Localizar qualquer códon por nº do aminoácido
- ✅ Stop codon automático
- ✅ Gerar documento Word completo ou somente éxons
- ✅ Grifar stop codon (vermelho) e códon localizado (roxo)
- ✅ Isolar 5' UTR em azul
