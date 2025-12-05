# IRFF Dashboard

Dashboard IRFF construído com React, Vite, TypeScript, Firebase e Material UI.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server extremamente rápido
- **TypeScript** - Superset JavaScript com tipagem estática
- **Material UI** - Biblioteca de componentes React
- **Firebase** - Plataforma de desenvolvimento (autenticação será configurada)
- **React Router** - Roteamento para React

## 📦 Instalação

```bash
npm install
```

## 🏃‍♂️ Como executar

### Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Build de produção

```bash
npm run build
```

### Preview da build

```bash
npm start
```

## 📁 Estrutura do Projeto

```
IRFF/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── routes/          # Configuração de rotas
│   ├── sections/        # Seções das páginas
│   ├── theme/           # Configuração do tema Material UI
│   ├── app.tsx          # Componente principal da aplicação
│   ├── main.tsx         # Entry point
│   └── global.css       # Estilos globais
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Paleta de Cores

- **Primary (Principal)**: #900B0D (Vermelho)
- **Secondary (Secundário)**: #8E33FF (Roxo)
- **Info**: #00B8D9 (Ciano)
- **Success (Sucesso)**: #22C55E (Verde)
- **Warning (Aviso)**: #FFAB00 (Amarelo)
- **Error (Erro)**: #FF5630 (Vermelho)

## 📄 Páginas

- **/login** - Página de login
- **/home** - Página inicial (dashboard)

## ⚠️ Observações

A autenticação com Firebase será configurada posteriormente.

