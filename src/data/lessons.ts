import {
  loadBalancerSteps,
  cacheSteps,
  databaseSteps,
  microservicesSteps,
  cdnSteps,
  messageQueueSteps,
  apiGatewaySteps,
  rateLimitingSteps,
  serviceDiscoverySteps,
  circuitBreakerSteps,
  consistentHashingSteps,
  objectStorageSteps,
  searchSteps,
  websocketsSteps,
  pubsubSteps,
  capTheoremSteps,
  idempotencySteps,
  observabilitySteps,
  bffSteps,
  sagaPatternSteps,
  cqrsEventSourcingSteps,
  stranglerFigSteps,
  databasePerServiceSteps,
  retryTimeoutSteps,
  bulkheadSteps,
  healthChecksSteps,
} from './lessonSteps'

export type SceneId =
  | 'load-balancer'
  | 'cache'
  | 'database'
  | 'microservices'
  | 'cdn'
  | 'message-queue'
  | 'api-gateway'
  | 'rate-limiting'
  | 'service-discovery'
  | 'circuit-breaker'
  | 'consistent-hashing'
  | 'object-storage'
  | 'search'
  | 'websockets'
  | 'pubsub'
  | 'cap-theorem'
  | 'idempotency'
  | 'observability'
  | 'bff'
  | 'saga-pattern'
  | 'cqrs-event-sourcing'
  | 'strangler-fig'
  | 'database-per-service'
  | 'retry-timeout'
  | 'bulkhead'
  | 'health-checks'

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  xpReward: number
  scene: SceneId
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
    title: 'Microsserviços',
    description: 'Arquitetura baseada em serviços independentes e escaláveis.',
    duration: '28 min',
    xpReward: 50,
    scene: 'microservices',
    diagram: 'microservices',
    steps: microservicesSteps,
    quiz: [
      { question: 'Como microsserviços se comunicam tipicamente?', options: ['Compartilhando o mesmo banco', 'Via APIs (REST, gRPC) ou mensageria', 'Apenas por arquivos', 'Não se comunicam'], correct: 1 },
      { question: 'Uma vantagem de microsserviços é:', options: ['Menor complexidade operacional', 'Deploy e escalabilidade por serviço', 'Sempre menor latência', 'Um único banco central'], correct: 1 },
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
  {
    id: 'message-queue',
    title: 'Message Queue',
    description: 'Filas de mensagens para desacoplar produtores e consumidores.',
    duration: '15 min',
    xpReward: 50,
    scene: 'message-queue',
    diagram: 'message-queue',
    steps: messageQueueSteps,
    quiz: [
      { question: 'Em uma fila (queue), cada mensagem é consumida por:', options: ['Todos os consumidores', 'Um único consumidor', 'Apenas o produtor', 'O load balancer'], correct: 1 },
      { question: 'Para evitar processar a mesma mensagem duas vezes, o consumidor deve ser:', options: ['Rápido', 'Idempotente', 'Síncrono', 'Stateless'], correct: 1 },
    ],
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    description: 'Ponto de entrada único: roteamento, auth, rate limit e mais.',
    duration: '15 min',
    xpReward: 50,
    scene: 'api-gateway',
    diagram: 'api-gateway',
    steps: apiGatewaySteps,
    quiz: [
      { question: 'O API Gateway normalmente NÃO faz:', options: ['Roteamento por path', 'Autenticação', 'Lógica de negócio do domínio', 'Rate limiting'], correct: 2 },
      { question: 'BFF significa:', options: ['Backend for Frontend', 'Best Friend Forever', 'Binary File Format', 'Backup for Failover'], correct: 0 },
    ],
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting',
    description: 'Limite a taxa de requisições por cliente para proteger o sistema.',
    duration: '12 min',
    xpReward: 50,
    scene: 'rate-limiting',
    diagram: 'rate-limiting',
    steps: rateLimitingSteps,
    quiz: [
      { question: 'Qual código HTTP é tipicamente retornado ao exceder o rate limit?', options: ['500', '403', '429', '503'], correct: 2 },
      { question: 'Token bucket é um algoritmo usado para:', options: ['Criptografia', 'Rate limiting', 'Compressão', 'Cache'], correct: 1 },
    ],
  },
  {
    id: 'service-discovery',
    title: 'Service Discovery',
    description: 'Descubra dinamicamente onde os serviços estão em ambientes escaláveis.',
    duration: '12 min',
    xpReward: 50,
    scene: 'service-discovery',
    diagram: 'service-discovery',
    steps: serviceDiscoverySteps,
    quiz: [
      { question: 'Em Kubernetes, o recurso que fornece discovery estável para Pods é:', options: ['Pod', 'Deployment', 'Service', 'ConfigMap'], correct: 2 },
      { question: 'Service discovery é especialmente útil quando:', options: ['Os IPs dos serviços são fixos', 'As instâncias mudam de IP/porta (containers)', 'Há apenas um servidor', 'Não há rede'], correct: 1 },
    ],
  },
  {
    id: 'circuit-breaker',
    title: 'Circuit Breaker',
    description: 'Evite chamadas repetidas a um serviço que está falhando.',
    duration: '12 min',
    xpReward: 50,
    scene: 'circuit-breaker',
    diagram: 'circuit-breaker',
    steps: circuitBreakerSteps,
    quiz: [
      { question: 'Quando o circuito está "open", o que acontece?', options: ['Chamadas passam normalmente', 'Chamadas falham imediatamente sem ir à rede', 'Só uma chamada de teste é permitida', 'O serviço reinicia'], correct: 1 },
      { question: 'Circuit breaker ajuda a:', options: ['Aumentar a latência', 'Evitar cascata de falhas e falhar rápido', 'Substituir o banco de dados', 'Aumentar o acoplamento'], correct: 1 },
    ],
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    description: 'Distribua chaves entre nós com mínimo remapeamento ao escalar.',
    duration: '12 min',
    xpReward: 50,
    scene: 'consistent-hashing',
    diagram: 'consistent-hashing',
    steps: consistentHashingSteps,
    quiz: [
      { question: 'Consistent hashing é útil principalmente para:', options: ['Criptografia', 'Reduzir remapeamento ao adicionar/remover nós', 'Ordenar dados', 'Comprimir arquivos'], correct: 1 },
      { question: 'Virtual nodes (vnodes) no consistent hashing servem para:', options: ['Aumentar segurança', 'Distribuição mais uniforme entre nós físicos', 'Reduzir memória', 'Acelerar hashing'], correct: 1 },
    ],
  },
  {
    id: 'object-storage',
    title: 'Object Storage',
    description: 'Armazene blobs (S3, GCS) de forma escalável e durável.',
    duration: '12 min',
    xpReward: 50,
    scene: 'object-storage',
    diagram: 'object-storage',
    steps: objectStorageSteps,
    quiz: [
      { question: 'Object storage (ex.: S3) é otimizado para:', options: ['Transações ACID', 'Grandes volumes e durabilidade', 'Queries SQL complexas', 'Sessões em memória'], correct: 1 },
      { question: 'Objetos em S3 são tipicamente:', options: ['Editados no lugar', 'Imutáveis (novo upload = nova versão)', 'Sempre em memória', 'Comprimidos automaticamente'], correct: 1 },
    ],
  },
  {
    id: 'search',
    title: 'Full-text Search',
    description: 'Busca em texto com relevância (Elasticsearch, OpenSearch).',
    duration: '12 min',
    xpReward: 50,
    scene: 'search',
    diagram: 'search',
    steps: searchSteps,
    quiz: [
      { question: 'Full-text search usa tipicamente:', options: ['Tabela hash', 'Índice invertido', 'Árvore B', 'Lista encadeada'], correct: 1 },
      { question: 'Elasticsearch/OpenSearch é mais indicado para:', options: ['Transações bancárias', 'Busca por texto e relevância', 'Cache em memória', 'Load balancing'], correct: 1 },
    ],
  },
  {
    id: 'websockets',
    title: 'WebSockets',
    description: 'Comunicação bidirecional em tempo real sobre uma conexão.',
    duration: '12 min',
    xpReward: 50,
    scene: 'websockets',
    diagram: 'websockets',
    steps: websocketsSteps,
    quiz: [
      { question: 'WebSocket é adequado para:', options: ['Request-response único', 'Comunicação bidirecional em tempo real', 'Download de arquivos estáticos', 'Rate limiting'], correct: 1 },
      { question: 'Para escalar WebSockets horizontalmente, geralmente se usa:', options: ['Apenas mais servidores', 'Backplane (ex.: Redis Pub/Sub) para broadcast entre instâncias', 'Um único servidor maior', 'Desabilitar sticky session'], correct: 1 },
    ],
  },
  {
    id: 'pubsub',
    title: 'Pub/Sub',
    description: 'Publicar e assinar eventos para desacoplar serviços.',
    duration: '12 min',
    xpReward: 50,
    scene: 'pubsub',
    diagram: 'pubsub',
    steps: pubsubSteps,
    quiz: [
      { question: 'No modelo Pub/Sub, o publicador:', options: ['Conhece todos os assinantes', 'Não precisa saber quem consome as mensagens', 'Só pode haver um assinante', 'Envia apenas uma vez'], correct: 1 },
      { question: 'Kafka e SNS são exemplos de:', options: ['Load balancers', 'Sistemas de mensageria Pub/Sub ou similares', 'Bancos relacionais', 'CDNs'], correct: 1 },
    ],
  },
  // --- System Design: fundamentos ---
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    description: 'Consistência, disponibilidade e tolerância a partição em sistemas distribuídos.',
    duration: '20 min',
    xpReward: 50,
    scene: 'cap-theorem',
    diagram: 'cap-theorem',
    steps: capTheoremSteps,
    quiz: [
      { question: 'Em caso de partição de rede, o teorema CAP diz que você deve escolher entre:', options: ['Consistência e disponibilidade', 'Consistência ou disponibilidade (P é inevitável)', 'Apenas disponibilidade', 'Apenas consistência'], correct: 1 },
      { question: 'Um sistema AP em partição prioriza:', options: ['Rejeitar requisições para manter dados corretos', 'Responder sempre, aceitando dados possivelmente desatualizados', 'Travar até a rede voltar', 'Usar 2PC'], correct: 1 },
    ],
  },
  {
    id: 'idempotency',
    title: 'Idempotência',
    description: 'Garantir que retentativas não causem efeitos duplicados em sistemas distribuídos.',
    duration: '22 min',
    xpReward: 50,
    scene: 'idempotency',
    diagram: 'microservices',
    steps: idempotencySteps,
    quiz: [
      { question: 'Idempotency Key serve para:', options: ['Criptografar a requisição', 'Identificar a intenção para evitar processar duas vezes', 'Aumentar a velocidade', 'Balancear carga'], correct: 1 },
      { question: 'Em at-least-once delivery, o consumidor deve ser:', options: ['Rápido', 'Idempotente', 'Síncrono', 'Stateless'], correct: 1 },
    ],
  },
  {
    id: 'observability',
    title: 'Observabilidade',
    description: 'Métricas, logs e traces para entender e debugar sistemas distribuídos.',
    duration: '28 min',
    xpReward: 50,
    scene: 'observability',
    diagram: 'microservices',
    steps: observabilitySteps,
    quiz: [
      { question: 'Os três pilares clássicos da observabilidade são:', options: ['CPU, memória, disco', 'Métricas, logs, traces', 'Auth, rate limit, cache', 'API, DB, fila'], correct: 1 },
      { question: 'Para correlacionar logs de uma mesma requisição em vários serviços, usa-se:', options: ['user_id', 'trace_id ou request_id', 'timestamp', 'hostname'], correct: 1 },
    ],
  },
  // --- Patterns de microsserviços ---
  {
    id: 'bff',
    title: 'BFF (Backend for Frontend)',
    description: 'Agregue chamadas e otimize payloads por tipo de cliente (web, mobile).',
    duration: '20 min',
    xpReward: 50,
    scene: 'bff',
    diagram: 'bff',
    steps: bffSteps,
    quiz: [
      { question: 'BFF é principalmente usado para:', options: ['Substituir o API Gateway', 'Agregar chamadas e otimizar resposta por tipo de cliente', 'Fazer apenas autenticação', 'Balancear carga'], correct: 1 },
      { question: 'BFF e API Gateway podem coexistir?', options: ['Não, é um ou outro', 'Sim: Gateway na borda, BFF para agregação por cliente'], correct: 1 },
    ],
  },
  {
    id: 'saga-pattern',
    title: 'Saga',
    description: 'Transações distribuídas com compensações em microsserviços.',
    duration: '25 min',
    xpReward: 50,
    scene: 'saga-pattern',
    diagram: 'saga-pattern',
    steps: sagaPatternSteps,
    quiz: [
      { question: 'Em uma saga, quando um passo falha:', options: ['Toda a transação faz rollback automático', 'Executam-se compensações na ordem inversa', 'O sistema trava', 'Ignora-se o erro'], correct: 1 },
      { question: 'Saga orquestrada tem:', options: ['Cada serviço publicando eventos', 'Um orquestrador central chamando cada participante'], correct: 1 },
    ],
  },
  {
    id: 'cqrs-event-sourcing',
    title: 'CQRS e Event Sourcing',
    description: 'Separe leitura e escrita; persista eventos em vez só do estado atual.',
    duration: '28 min',
    xpReward: 50,
    scene: 'cqrs-event-sourcing',
    diagram: 'cqrs-event-sourcing',
    steps: cqrsEventSourcingSteps,
    quiz: [
      { question: 'Em CQRS, o read model é tipicamente:', options: ['O mesmo banco do write', 'Uma projeção atualizada por eventos', 'Apenas cache', 'Não existe read model'], correct: 1 },
      { question: 'Event Sourcing persiste:', options: ['Apenas o estado atual', 'O histórico de eventos que ocorreram'], correct: 1 },
    ],
  },
  {
    id: 'strangler-fig',
    title: 'Strangler Fig',
    description: 'Migre do monolito para microsserviços gradualmente, sem big bang.',
    duration: '18 min',
    xpReward: 50,
    scene: 'strangler-fig',
    diagram: 'strangler-fig',
    steps: stranglerFigSteps,
    quiz: [
      { question: 'No padrão Strangler Fig, o tráfego é desviado para novos serviços via:', options: ['Reescrevendo o monolito', 'Proxy ou API Gateway na frente', 'Desligando o monolito de uma vez', 'Não há desvio'], correct: 1 },
      { question: 'A migração no Strangler é feita:', options: ['De uma vez (big bang)', 'Gradualmente, por rota ou domínio'], correct: 1 },
    ],
  },
  {
    id: 'database-per-service',
    title: 'Database per Service',
    description: 'Cada microsserviço possui e acessa apenas o próprio banco de dados.',
    duration: '22 min',
    xpReward: 50,
    scene: 'database-per-service',
    diagram: 'database-per-service',
    steps: databasePerServiceSteps,
    quiz: [
      { question: 'No database per service, um serviço pode acessar o banco de outro?', options: ['Sim, para fazer joins', 'Não; acessa apenas via API do outro serviço', 'Apenas em leitura', 'Apenas em escrita'], correct: 1 },
      { question: 'Para operações que envolvem dois serviços, usa-se:', options: ['Transação 2PC', 'Saga ou consistência eventual'], correct: 1 },
    ],
  },
  {
    id: 'retry-timeout',
    title: 'Retry e Timeout',
    description: 'Retentativas com backoff e timeouts para resiliência em chamadas distribuídas.',
    duration: '18 min',
    xpReward: 50,
    scene: 'retry-timeout',
    diagram: 'microservices',
    steps: retryTimeoutSteps,
    quiz: [
      { question: 'Retry com backoff exponencial ajuda a:', options: ['Aumentar a carga no serviço em falha', 'Dar tempo de recuperação e evitar thundering herd', 'Eliminar a necessidade de timeout', 'Substituir o circuit breaker'], correct: 1 },
      { question: 'Timeout em chamadas a outros serviços deve ser:', options: ['Maior que o timeout do cliente final', 'Menor que o timeout do cliente final para poder retornar erro/fallback', 'Sempre 30 segundos', 'Desabilitado'], correct: 1 },
    ],
  },
  {
    id: 'bulkhead',
    title: 'Bulkhead',
    description: 'Isole recursos (threads, conexões) para que uma falha não derrube todo o sistema.',
    duration: '16 min',
    xpReward: 50,
    scene: 'bulkhead',
    diagram: 'microservices',
    steps: bulkheadSteps,
    quiz: [
      { question: 'O padrão Bulkhead isola:', options: ['Apenas rede', 'Recursos (threads, conexões) por partição', 'Apenas banco de dados', 'Apenas cache'], correct: 1 },
      { question: 'Bulkhead evita que:', options: ['Um serviço fique lento', 'Uma partição sobrecarregada consuma todos os recursos e derrube as outras', 'Haja retry', 'Haja timeout'], correct: 1 },
    ],
  },
  {
    id: 'health-checks',
    title: 'Health Checks',
    description: 'Liveness e readiness para orquestração e load balancer.',
    duration: '16 min',
    xpReward: 50,
    scene: 'health-checks',
    diagram: 'microservices',
    steps: healthChecksSteps,
    quiz: [
      { question: 'Se o liveness probe falhar no Kubernetes:', options: ['O Pod deixa de receber tráfego', 'O Pod é reiniciado', 'Nada acontece', 'Só o readiness falha'], correct: 1 },
      { question: 'Readiness probe indica:', options: ['Que o processo está vivo', 'Que o processo está pronto para receber tráfego'], correct: 1 },
    ],
  },
]
