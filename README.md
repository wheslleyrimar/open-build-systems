# System Design — Plataforma de ensino gamificada

Este repositório foi criado para a comunidade **[Tech na Prática](https://technapratica.com.br/)** — mentorias e conteúdo aplicado para carreira em tecnologia (arquitetura, carreira e liderança).

Aplicação web para aprender **System Design** com diagramas interativos, visualizações 3D e efeitos de animação, em uma experiência gamificada (XP, níveis, conquistas e sequência de dias).

## Funcionalidades

- **Diagramas animados**: Load Balancer, Cache, Replicação/Sharding, Microsserviços, CDN
- **Cenas 3D**: Cada tópico tem uma visualização 3D interativa (Three.js) — arraste para rotacionar, scroll para zoom
- **Conteúdo em etapas**: Explicações em passos com animações
- **Quizzes**: Perguntas ao final de cada lição com pontuação e XP extra
- **Gamificação**:
  - **XP e níveis**: Ganhe XP ao completar lições e quizzes
  - **Sequência (streak)**: Dias seguidos estudando
  - **Conquistas**: Badges por primeira lição, 3 lições, todas as lições, streaks de 3 e 7 dias, quiz 100%

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # preview da build de produção
```

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (via `@tailwindcss/vite`)
- **React Three Fiber** + **Three.js** + **@react-three/drei** (3D)
- **Framer Motion** (animações)
- **React Router** (rotas)
- Progresso e gamificação persistidos em **localStorage**

## Estrutura

- `src/pages/` — Home (mapa de lições) e Lesson (conteúdo + diagrama + 3D + quiz)
- `src/components/diagrams/` — Diagramas SVG animados
- `src/scenes/` — Cenas 3D por tópico
- `src/context/GameContext.tsx` — Estado de jogo (XP, nível, badges, progresso)
- `src/data/lessons.ts` — Conteúdo das lições e quizzes

---

**Tech na Prática** — [technapratica.com.br](https://technapratica.com.br/)
