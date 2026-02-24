import {
  loadBalancerSteps,
  cacheSteps,
  databaseSteps,
  microservicesSteps,
  cdnSteps,
} from './lessonSteps'

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  xpReward: number
  scene: 'load-balancer' | 'cache' | 'database' | 'microservices' | 'cdn'
  diagram: string
  steps: { title: string; content: string }[]
  quiz?: { question: string; options: string[]; correct: number }[]
}

export const lessons: Lesson[] = [
  {
    id: 'load-balancer',
    title: 'Load Balancer',
    description: 'Distribua tráfego entre múltiplos servidores para alta disponibilidade.',
    duration: '25 min',
    xpReward: 50,
    scene: 'load-balancer',
    diagram: 'load-balancer',
    steps: loadBalancerSteps,
    quiz: [
      { question: 'Qual algoritmo envia cada requisição para o próximo servidor na lista?', options: ['Least Connections', 'Round Robin', 'IP Hash', 'Weighted'], correct: 1 },
      { question: 'Por que usamos Load Balancers em System Design?', options: ['Para reduzir custo', 'Para distribuir tráfego e aumentar disponibilidade', 'Para substituir o banco de dados', 'Apenas para desenvolvimento'], correct: 1 },
    ],
  },
  {
    id: 'cache',
    title: 'Cache',
    description: 'Reduza latência e carga no backend com camadas de cache.',
    duration: '28 min',
    xpReward: 50,
    scene: 'cache',
    diagram: 'cache',
    steps: cacheSteps,
    quiz: [
      { question: 'Na estratégia Cache-Aside, quem popula o cache?', options: ['O banco de dados', 'A aplicação', 'O load balancer', 'O CDN'], correct: 1 },
      { question: 'O que é TTL no contexto de cache?', options: ['Tamanho total do cache', 'Tempo que um item permanece válido no cache', 'Taxa de transferência', 'Tipo de load balancer'], correct: 1 },
    ],
  },
  {
    id: 'database',
    title: 'Replicação e Sharding',
    description: 'Escale leitura e escrita com réplicas e particionamento.',
    duration: '30 min',
    xpReward: 50,
    scene: 'database',
    diagram: 'database',
    steps: databaseSteps,
    quiz: [
      { question: 'Sharding divide os dados por quê?', options: ['Por tamanho de tabela', 'Por uma chave de particionamento (ex: user_id)', 'Por data de criação', 'Por ordem alfabética'], correct: 1 },
      { question: 'Réplicas secundárias são usadas principalmente para:', options: ['Escrever dados', 'Fazer backup apenas', 'Servir leituras e aumentar disponibilidade', 'Substituir o load balancer'], correct: 2 },
    ],
  },
  {
    id: 'microservices',
    title: 'Microserviços',
    description: 'Arquitetura baseada em serviços independentes e escaláveis.',
    duration: '28 min',
    xpReward: 50,
    scene: 'microservices',
    diagram: 'microservices',
    steps: microservicesSteps,
    quiz: [
      { question: 'Como microserviços se comunicam tipicamente?', options: ['Compartilhando o mesmo banco', 'Via APIs (REST, gRPC) ou mensageria', 'Apenas por arquivos', 'Não se comunicam'], correct: 1 },
      { question: 'Uma vantagem de microserviços é:', options: ['Menor complexidade operacional', 'Deploy e escalabilidade por serviço', 'Sempre menor latência', 'Um único banco central'], correct: 1 },
    ],
  },
  {
    id: 'cdn',
    title: 'CDN',
    description: 'Entregue conteúdo estático rápido em todo o mundo.',
    duration: '25 min',
    xpReward: 50,
    scene: 'cdn',
    diagram: 'cdn',
    steps: cdnSteps,
    quiz: [
      { question: 'CDN é mais útil para:', options: ['APIs dinâmicas em tempo real', 'Conteúdo estático e streaming próximo ao usuário', 'Processamento de pagamentos', 'Autenticação'], correct: 1 },
      { question: 'O que são PoPs em um CDN?', options: ['Tipos de cache', 'Pontos de presença (servidores distribuídos)', 'Protocolos de rede', 'Formatos de vídeo'], correct: 1 },
    ],
  },
]
