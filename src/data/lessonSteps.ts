/**
 * Conteúdo em formato de artigo profundo para cada lição.
 * Cada passo pode usar Markdown (títulos, listas, código).
 */

export type Step = { title: string; content: string }

export const loadBalancerSteps: Step[] = [
  {
    title: 'O que é um Load Balancer?',
    content: `Um **Load Balancer** (balanceador de carga) é um componente de rede ou software que atua como **ponto de entrada único** para o tráfego de clientes e **distribui as requisições** entre vários servidores backend (pool ou farm).

Em vez de um único servidor receber todo o tráfego — o que levaria a sobrecarga, lentidão e risco de falha total — o load balancer espalha as requisições entre múltiplas instâncias, melhorando:

- **Disponibilidade**: se um nó cai, os outros continuam atendendo
- **Throughput**: mais requisições por segundo no total
- **Latência**: evita que um servidor fique sobrecarregado e lento

Em entrevistas de system design e na prática, o load balancer costuma aparecer na **primeira camada** atrás do cliente: o usuário acessa um endereço (ou DNS), que resolve para o IP do load balancer; este escolhe qual instância do seu serviço vai atender aquela requisição. Assim você escala **horizontalmente**: adiciona mais máquinas e o balanceador distribui o trabalho.`,
  },
  {
    title: 'Algoritmos de distribuição',
    content: `O algoritmo define **como** o balanceador escolhe o próximo servidor.

**Round Robin**  
Cada nova requisição vai para o próximo servidor na lista, em ciclo. Simples e previsível, mas não considera carga ou tempo de resposta. Bom quando os backends são homogêneos.

**Least Connections**  
A requisição é enviada ao servidor com **menos conexões ativas**. Muito útil quando as requisições têm durações muito diferentes (ex.: algumas são rápidas, outras ficam em long polls ou uploads). Servidores mais ocupados recebem menos carga nova.

**IP Hash (ou consistent hashing)**  
A mesma chave (ex.: IP do cliente ou cookie) leva sempre ao mesmo servidor. Útil para **sticky session** (sessão em memória em um servidor) ou quando o cache local do servidor beneficia repetição do mesmo cliente.

**Weighted Round Robin / Weighted Least Connections**  
Cada servidor tem um **peso** (por CPU, memória, etc.). Servidores mais potentes recebem mais requisições. Permite misturar máquinas de tamanhos diferentes no mesmo pool.`,
  },
  {
    title: 'Exemplo: NGINX como Load Balancer',
    content: `O NGINX pode atuar como load balancer na camada 7 (HTTP). Abaixo, um upstream com **least_conn** e health checks implícitos via \`max_fails\` e \`fail_timeout\`.

\`\`\`nginx
upstream backend {
    least_conn;
    server 10.0.1.1:80 max_fails=3 fail_timeout=30s;
    server 10.0.1.2:80 max_fails=3 fail_timeout=30s;
    server 10.0.1.3:80 max_fails=3 fail_timeout=30s backup;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

- \`backup\`: esse servidor só é usado se os outros estiverem indisponíveis.
- \`max_fails=3 fail_timeout=30s\`: após 3 falhas consecutivas, o servidor é marcado como down por 30 segundos.`,
  },
  {
    title: 'Exemplo: AWS Application Load Balancer (ALB)',
    content: `Em nuvem, o balanceamento é um **serviço gerenciado**. No AWS ALB:

- Você cria um **Target Group** com as instâncias (ou IPs) do backend.
- O ALB faz **health checks** configuráveis (path, intervalo, threshold).
- Escolha do algoritmo: Round Robin é o padrão; para sticky session você habilita **stickiness** por cookie.
- **Listener rules** permitem roteamento por path, host ou header (ex.: \`/api/*\` para um target group, \`/*\` para outro).

**Vantagens**: não gerencia servidor de LB, escala automático, integração com EC2/ECS/Lambda. **Custo**: cobrança por LCU (Load Balancer Capacity Unit) e por hora. Para milhões de requisições, o custo pode ser relevante; avalie NLB (camada 4) ou mesmo NGINX em EC2 para cargas muito altas.`,
  },
  {
    title: 'Health checks e failover',
    content: `O load balancer precisa saber **quais servidores estão saudáveis**. Para isso ele faz **health checks** periódicos:

- **HTTP**: GET em um path (ex.: \`/health\`) e considera "up" se retornar 2xx.
- **TCP**: abre uma conexão na porta do serviço; se conectar, considera "up".
- **Configuração típica**: intervalo (ex.: 10s), timeout (ex.: 5s), \`healthy threshold\` (quantos checks ok para voltar ao pool), \`unhealthy threshold\` (quantos falhas para remover do pool).

Se um servidor falhar vários checks seguidos, ele é **removido do pool** (drain) e deixa de receber tráfego até voltar a responder. Isso evita que usuários caiam em instâncias quebradas.

**Failover do próprio LB**: em alta disponibilidade, o load balancer também pode ser redundante — dois ou mais nós ativos com um IP virtual (VIP) ou DNS, usando protocolos como **VRRP/keepalived** para failover. Assim o balanceador deixa de ser single point of failure.`,
  },
  {
    title: 'Quando usar e benefícios',
    content: `**Use load balancer sempre que** tiver mais de uma instância do mesmo serviço atrás de um único endpoint (HTTP, TCP, etc.).

**Benefícios resumidos**:
- **Alta disponibilidade**: um nó pode cair sem derrubar o serviço.
- **Escalabilidade horizontal**: mais tráfego → mais instâncias no pool.
- **Tolerância a falhas**: nós com falha são isolados até correção.
- **Melhor uso de recursos**: evita um servidor ocioso e outro sobrecarregado.

Em arquiteturas de **microserviços**, cada serviço pode ter seu próprio load balancer ou você usa um **API Gateway** que já faz esse papel. Em **Kubernetes**, o Service (ClusterIP/NodePort/LoadBalancer) e os **Ingress controllers** (NGINX, Traefik, etc.) cumprem a função de balanceamento.`,
  },
  {
    title: 'Camada 4 vs camada 7',
    content: `**Layer 4 (L4)**  
Balanceamento baseado em **IP e porta** (TCP/UDP). O LB não inspeciona o conteúdo; apenas encaminha pacotes. Menor latência e menor custo de processamento. Ex.: AWS NLB, HAProxy em modo TCP.

**Layer 7 (L7)**  
Balanceamento baseado em **HTTP**: URL path, headers, cookies. Permite roteamento fino (ex.: \`/api\` para um backend, \`/static\` para outro), SSL termination no LB, e sticky session por cookie. Maior flexibilidade, maior latência e custo. Ex.: AWS ALB, NGINX, HAProxy em modo HTTP.

**Escolha**: use L4 quando precisar apenas distribuir conexões TCP (ex.: banco de dados, WebSocket puro). Use L7 quando precisar de roteamento por path, headers ou SSL termination centralizado.`,
  },
  {
    title: 'Trade-offs e boas práticas',
    content: `**Trade-offs**:
- O load balancer é um **ponto central**: precisa ser altamente disponível (redundância, health checks do próprio LB).
- **Latência adicional**: uma espera no LB (mesmo que pequena) e possível SSL termination.
- **Configuração**: manter lista de backends, health checks e regras atualizadas.

**Boas práticas**:
- Sempre configure **health checks** adequados ao seu serviço.
- Use **connection draining** ao fazer deploy: retire o nó do pool antes de parar o processo para não cortar conexões ativas.
- Em cloud, prefira LB gerenciado a menos que tenha necessidade muito específica (ex.: custo em escala massiva).
- Documente o algoritmo escolhido e o critério (ex.: "Least Connections porque temos long polling").`,
  },
]

export const cacheSteps: Step[] = [
  {
    title: 'Conceito e por que cachear',
    content: `**Cache** é uma camada de armazenamento de **acesso rápido** (em geral memória RAM ou disco SSD) que guarda **cópias** de dados frequentemente acessados.

Em vez de a aplicação ir sempre ao banco de dados ou a um serviço remoto — o que custa latência de rede e carga no backend — ela **consulta primeiro o cache**. Se o dado estiver lá (**cache hit**), a resposta é muito mais rápida; se não estiver (**cache miss**), a aplicação busca na fonte, devolve ao usuário e, em muitas estratégias, **popula o cache** para as próximas requisições.

**Benefícios**:
- **Redução de latência**: memória/disco local são ordens de magnitude mais rápidos que uma ida à rede (ex.: 0,1 ms vs 10–50 ms).
- **Redução de carga** no banco ou no serviço de origem (menos leituras, menor custo).
- **Maior throughput**: a aplicação atende mais requisições por segundo.

**Trade-off**: complexidade de **invalidação** e **consistência** — o cache pode ficar desatualizado se os dados na origem mudarem e o cache não for atualizado ou expirado.`,
  },
  {
    title: 'Estratégias: Cache-Aside, Write-Through, Write-Behind',
    content: `**Cache-Aside (Lazy Loading)**  
A **aplicação** é responsável pelo cache. **Leitura**: consulta o cache; em miss, busca no banco, grava no cache e devolve. **Escrita**: atualiza o banco e **invalida** (ou atualiza) a chave no cache. Abordagem mais comum e flexível; cuidado com race conditions (duas requisições populando o mesmo miss).

**Write-Through**  
Toda escrita vai **primeiro para o cache** e o cache propaga **sincronamente** para o banco. Leitura é sempre no cache. Cache e banco ficam sincronizados após cada escrita, mas cada escrita paga a latência de ir ao banco — pode ser gargalo em alta taxa de escrita.

**Write-Behind (Write-Back)**  
Aplicação escreve no cache; a escrita no banco é **assíncrona** (em lote ou em background). Leituras são servidas pelo cache. Escrita muito rápida e menor pico no banco, mas **risco de perda** se o cache falhar antes de persistir; consistência é **eventual**. Usado quando alta taxa de escrita e menor consistência imediata são aceitáveis.`,
  },
  {
    title: 'Exemplo: Redis com Cache-Aside em código',
    content: `Pseudocódigo típico de **Cache-Aside** com Redis:

\`\`\`python
def get_user(user_id: str) -> User:
    cache_key = f"user:{user_id}"
    # 1. Tenta cache
    data = redis.get(cache_key)
    if data is not None:
        return deserialize(data)   # cache hit
    # 2. Miss: busca no banco
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    if user is None:
        return None
    # 3. Popula cache (TTL ex.: 5 min)
    redis.setex(cache_key, 300, serialize(user))
    return user

def update_user(user_id: str, payload: dict):
    db.update("users", user_id, payload)
    redis.delete(f"user:{user_id}")   # invalidação
\`\`\`

**Pontos importantes**: TTL evita dados eternamente obsoletos; na escrita invalidamos a chave para forçar nova leitura do banco na próxima requisição. Em cenários de alta concorrência, pode haver **cache stampede** no miss (muitas requisições batendo no DB ao mesmo tempo); mitigações incluem lock distribuído ou "early expiration" com background refresh.`,
  },
  {
    title: 'TTL, invalidação e eviction',
    content: `**TTL (Time To Live)**  
Cada entrada no cache pode ter um tempo de vida em segundos. Após esse tempo, a entrada é considerada **expirada** e a próxima leitura resulta em miss. TTL evita que dados obsoletos fiquem para sempre, mas **não garante** consistência forte: a origem pode mudar antes do TTL expirar.

**Invalidação**  
Quando a origem é atualizada, você pode **invalidar** (remover) ou **atualizar** as chaves afetadas no cache. Invalidação por **evento** (ex.: publicar em um canal após atualizar o banco) ou por **tempo** (TTL) são comuns. Em sistemas distribuídos, invalidação entre vários nós de cache exige um barramento (ex.: **Redis Pub/Sub**) ou aceitar janelas de inconsistência.

**Eviction**  
Quando o cache **enche**, é preciso remover algo. Políticas comuns: **LRU** (Least Recently Used), **LFU** (Least Frequently Used), **FIFO**. No Redis, \`maxmemory-policy volatile-lru\` remove chaves com TTL pelas menos usadas recentemente.`,
  },
  {
    title: 'Onde colocar o cache e exemplos',
    content: `Cache pode ficar em **várias camadas**:

- **Em processo**: mapa em memória na aplicação (rápido, mas não compartilhado entre instâncias).
- **Servidor dedicado**: Redis, Memcached — compartilhado por várias instâncias da app.
- **Borda**: CDN, cache de HTTP em proxies — próximo ao usuário.

**Padrão comum**: \`usuário → load balancer → N instâncias da app → Redis (cache compartilhado) → banco de dados\`.

**Redis** e **Memcached** são os mais usados para cache distribuído: pares chave-valor em memória, TTL e políticas de eviction. Use cache para: resultados de queries pesadas, respostas de APIs externas, sessões, fragmentos de página. **Evite** cachear dados que mudam a todo momento ou que exigem consistência forte sem estratégia clara de invalidação.`,
  },
  {
    title: 'Exemplo: configuração Redis para cache',
    content: `Configuração típica do Redis como cache (ex.: \`redis.conf\` ou parâmetros):

\`\`\`
maxmemory 2gb
maxmemory-policy allkeys-lru
\`\`\`

- \`maxmemory\`: limite de uso de RAM; além disso a eviction entra em ação.
- \`allkeys-lru\`: remove qualquer chave (incluindo as sem TTL) pelas menos usadas recentemente. Alternativas: \`volatile-lru\` (só chaves com TTL), \`volatile-ttl\` (remover as mais próximas de expirar).

Para aplicação em alta disponibilidade, use **Redis Sentinel** ou **Redis Cluster**; para cache, muitas vezes um único nó com persistência desabilitada (ou RDB ocasional) é suficiente, com réplica para failover.`,
  },
]

export const databaseSteps: Step[] = [
  {
    title: 'Replicação: primária e réplicas',
    content: `**Replicação** significa manter **cópias dos mesmos dados** em vários nós. No modelo **primária-réplica** (primary-replica):

- Um nó é o **primário** e recebe **todas as escritas**.
- As **réplicas** replicam os dados a partir do primário (via log de transações, WAL ou stream de mudanças) e em geral **servem apenas leituras**.

Assim você escala a **capacidade de leitura** adicionando réplicas, enquanto as escritas continuam concentradas no primário.

**Síncrona vs assíncrona**:  
- **Síncrona**: o primário só confirma a escrita quando pelo menos uma réplica confirmar. Mais durabilidade, menor risco de perda em falha do primário, mas **maior latência** de escrita.  
- **Assíncrona**: o primário confirma e as réplicas recebem as mudanças depois. Mais comum em alta throughput; aceita **replication lag** e **consistência eventual**.`,
  },
  {
    title: 'Leitura nas réplicas e replication lag',
    content: `Ao **rotear leituras para réplicas**, você reduz a carga no primário. Porém, como a replicação é em geral assíncrona, uma leitura **logo após uma escrita** pode ser feita em uma réplica que ainda **não recebeu** a atualização — o usuário "não vê" a mudança que acabou de fazer (**read-after-write inconsistency**).

**Mitigações**:
- Rotear a leitura **imediatamente após uma escrita** de volta para o **primário** (ou para uma réplica com lag conhecido e baixo).
- O resto das leituras vai para réplicas.

**Monitorar o replication lag** é essencial: se uma réplica ficar muito atrás, as leituras nela estarão desatualizadas e, em caso de **failover**, pode haver perda de dados ou atraso na promoção. Muitos bancos expõem métricas de lag (ex.: segundos atrás do primário) para alertas e decisões de roteamento.`,
  },
  {
    title: 'Sharding (particionamento horizontal)',
    content: `**Sharding** é a técnica de **particionar os dados** em vários bancos (shards), de forma que cada shard guarde um **subconjunto** dos dados. A **chave de particionamento** (ex.: \`user_id\`, \`tenant_id\`, \`hash(id)\`) determina em **qual shard** cada registro vai.

Assim, a carga de **escrita** e o **volume de dados** são distribuídos entre vários nós, permitindo escalar além do que uma única instância suporta.

Cada shard é tipicamente um banco independente (ou um conjunto primária-réplicas). A aplicação ou um **proxy** (ex.: Vitess, ProxySQL) precisa saber como **rotear**: para escrever ou ler um registro, calcula o shard a partir da chave e envia a operação ao nó correto.

**Desafio**: queries que precisam de dados em **mais de um shard** (cross-shard) — ou você evita (modelo desenhado para que a maioria das consultas seja por chave de shard), ou agrega resultados em aplicação (mais lento e complexo).`,
  },
  {
    title: 'Exemplo: chave de sharding e roteamento',
    content: `Exemplo conceitual de roteamento por \`user_id\`:

\`\`\`python
NUM_SHARDS = 16

def get_shard(user_id: str) -> int:
    return hash(user_id) % NUM_SHARDS

def get_user(user_id: str) -> User:
    shard_id = get_shard(user_id)
    conn = shard_pool[shard_id]   # conexão ao shard correto
    return conn.query("SELECT * FROM users WHERE id = ?", user_id)
\`\`\`

**Problemas comuns**:
- **Hot spots**: se a chave for desbalanceada (ex.: um tenant gigante), um shard pode ficar sobrecarregado.
- **Rebalanceamento**: ao adicionar ou remover shards, os dados precisam ser redistribuídos (consistent hashing ou rehash com downtime/dual-write).

Em sistemas como **MongoDB** ou **Cassandra**, o sharding é nativo; em MySQL/PostgreSQL, costuma-se usar proxy ou aplicação para rotear.`,
  },
  {
    title: 'Trade-offs e boas práticas',
    content: `**Replicação**: ganha leituras e disponibilidade, mas lida com **lag**, **consistência eventual** e **failover** (promover uma réplica a primária quando o primário cai).

**Sharding**: ganha escala de escrita e armazenamento, mas aumenta a **complexidade operacional** (rebalanceamento, backup/restore por shard, transações distribuídas quando necessário).

**Boas práticas**:
- Escolha uma chave de sharding que **distribua bem** a carga e evite hot spots.
- Prefira que a **maioria das queries** seja atendida por um único shard.
- Monitore **lag** e capacidade de cada shard.
- Planeje **rebalanceamento** e como lidará com junções entre shards (evite quando possível).

Em entrevistas de system design, replicação e sharding costumam aparecer **juntos**: réplicas para leitura e HA, sharding para escalar dados e escrita.`,
  },
]

export const microservicesSteps: Step[] = [
  {
    title: 'Definição e princípios',
    content: `**Microserviços** é um estilo de arquitetura em que o sistema é composto por **vários serviços pequenos e independentes**. Cada serviço:

- Roda em seu **próprio processo** (ou container).
- Tem sua **própria base de código** e ciclo de **deploy**.
- É responsável por um **domínio de negócio** delimitado (ex.: autenticação, usuários, pedidos, notificações).

Os serviços se comunicam por **rede**, com contratos bem definidos: em geral **APIs HTTP/REST** ou **gRPC**, ou **mensageria assíncrona** (filas, pub/sub), **em vez de compartilhar banco de dados ou memória**.

A ideia é que cada **equipe** possa desenvolver, testar e colocar em produção seu serviço com relativa **autonomia**, usando a stack que fizer sentido (linguagem, banco), desde que os **contratos de API** e eventos sejam respeitados. Isso contrasta com um **monolito**, em que todo o sistema é um único deploy.`,
  },
  {
    title: 'Vantagens e quando faz sentido',
    content: `**Vantagens**:
- **Escalabilidade por serviço**: você escala apenas os serviços sob carga (ex.: mais réplicas do serviço de pedidos em Black Friday).
- **Deploy independente**: uma equipe pode entregar mudanças no serviço de notificações sem release de todo o sistema.
- **Tecnologia heterogênea**: um serviço em Go, outro em Java, outro em Python.
- **Resiliência**: falha de um serviço pode ser isolada (circuit breaker, timeouts) e não derrubar todo o sistema.

**Quando faz sentido**: domínio grande o suficiente para justificar várias equipes e quando a **complexidade operacional** (deploy, monitoramento, rede) pode ser absorvida. Para sistemas pequenos ou equipe única, um **monolito bem modularizado** costuma ser mais simples de operar.`,
  },
  {
    title: 'Desafios: rede, consistência e operação',
    content: `**Latência de rede**: cada chamada entre serviços é uma ida à rede (latência, timeouts, falhas). É preciso desenhar APIs enxutas, usar cache quando possível e **evitar cadeias longas** de chamadas síncronas (preferir eventos assíncronos ou sagas).

**Consistência**: transações que abrangem vários serviços **não podem** usar ACID tradicional; você lida com **consistência eventual**, **compensações (sagas)** e **idempotência** para evitar efeitos colaterais em retentativas.

**Operação distribuída**: é preciso **observabilidade** (logs, métricas, traces) correlacionados entre serviços, deploy e configuração por serviço, e **versionamento de API** (backward compatibility). Testes end-to-end são mais difíceis; além de testes de contrato (consumer-driven), é comum usar ambientes que sobem todos os serviços ou mocks.`,
  },
  {
    title: 'API Gateway e comunicação',
    content: `O **API Gateway** é o **ponto de entrada único** para os clientes: roteia requisições para o microserviço correto, pode fazer **autenticação/autorização**, **rate limiting** e agregar respostas de vários serviços (padrão **BFF — Backend for Frontend**). Assim os clientes não precisam conhecer cada serviço.

**Entre os microserviços**:
- **Síncrona** (HTTP/gRPC): quando a resposta é necessária na hora.
- **Assíncrona** (RabbitMQ, Kafka, SQS): desacoplamento e tolerância a picos.

**Arquitetura orientada a eventos**: serviços publicam **eventos** (ex.: "Pedido criado") e outros **assinam** e reagem (ex.: serviço de notificações envia e-mail). Reduz acoplamento e permite que novos consumidores sejam adicionados sem alterar o produtor.`,
  },
  {
    title: 'Exemplo: evento de domínio',
    content: `Exemplo de evento publicado por um serviço de pedidos e consumido por notificações:

\`\`\`json
{
  "event_type": "order.created",
  "order_id": "ord_123",
  "user_id": "usr_456",
  "email": "user@example.com",
  "total": 99.90,
  "occurred_at": "2024-01-15T10:30:00Z"
}
\`\`\`

O serviço de **notificações** assina a fila/tópico, recebe o evento e envia o e-mail. O serviço de **pedidos** não conhece o de notificações; apenas publica o evento. Novos consumidores (ex.: analytics, estoque) podem ser adicionados sem mudar o produtor.`,
  },
]

export const cdnSteps: Step[] = [
  {
    title: 'O que é uma CDN?',
    content: `**CDN** (Content Delivery Network) é uma **rede de servidores distribuídos geograficamente** (pontos de presença — **PoPs**) que armazenam **cópias de conteúdo** estático (ou cacheável) **próximo aos usuários finais**.

Quando um usuário solicita um arquivo (imagem, CSS, JS, vídeo), a requisição é atendida pelo **servidor da CDN mais próximo** dele (em termos de latência de rede), em vez de ir até o **servidor de origem** (origin) do cliente. Assim, a **latência cai** e a **banda consumida na origem** também.

A CDN atua como uma **camada de cache distribuída**: na primeira vez que um recurso é pedido em uma região, o edge node da CDN **busca da origin**, armazena e atende as próximas requisições daquele recurso a partir do cache. O conteúdo é identificado por **URL** (e query strings, conforme configuração) e pode ter **TTL** definido pelos headers HTTP ou pela configuração na CDN.`,
  },
  {
    title: 'Benefícios e casos de uso',
    content: `**Benefícios**:
- **Menor latência**: usuários recebem o conteúdo de um nó próximo.
- **Menor carga na origem**: menos requisições e menos banda saindo do seu datacenter.
- **Melhor experiência global**: um usuário na Ásia não depende da latência até um servidor nos EUA.
- **Proteção contra picos**: em eventos (lançamentos, notícias virais), a CDN absorve a maior parte do tráfego estático. Muitas CDNs também oferecem **DDoS mitigation** e **WAF** na borda.

**Casos de uso**: entrega de **assets de front-end** (HTML, CSS, JS, imagens), **streaming de vídeo** (VOD e ao vivo), **downloads** de arquivos grandes, e até cache de **respostas de API** quando a resposta for cacheável por URL e tempo (com cuidado para não cachear dados sensíveis).`,
  },
  {
    title: 'Quando usar e quando não usar',
    content: `**Use CDN** para conteúdo **público** (ou cacheável na borda com critérios seguros), **estático ou pouco mutável**, acessado por **usuários distribuídos**. A maioria dos sites coloca pelo menos imagens, CSS e JS atrás de CDN.

**Para APIs dinâmicas ou personalizadas** (sessão, cookies), a CDN pode ser usada como **proxy** (roteamento, SSL termination) **com cache desabilitado** para essas rotas, ou as chamadas vão direto à origin.

**Não espere** que a CDN substitua a lógica de negócio: ela é uma camada de **entrega e cache**. **Invalidação (purge)** quando você atualiza um recurso é importante; muitas CDNs permitem invalidar por URL ou prefixo. Para conteúdo sensível, use **signed URLs** ou tokens com TTL curto.`,
  },
  {
    title: 'Exemplo: CloudFront e Cache-Control',
    content: `No **AWS CloudFront**, o comportamento de cache é definido por **path pattern** e pelos headers da origin. Exemplo de headers que a origin pode enviar:

\`\`\`http
Cache-Control: public, max-age=31536000, immutable
\`\`\`

- \`public\`: pode ser cacheado por CDN e browsers.
- \`max-age=31536000\`: 1 ano (comum para assets com hash no nome).
- \`immutable\`: o navegador não precisa revalidar enquanto não expirar.

Para **invalidar** após um deploy:

\`\`\`
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
\`\`\`

Ou por prefixo: \`/assets/*\`. Invalidação tem custo; use com critério e prefira versionamento de URL (ex.: \`/assets/main.abc123.js\`) para cache de longa duração.`,
  },
  {
    title: 'PoPs, origin e configuração',
    content: `**PoPs** (Points of Presence) são datacenters/nós da CDN espalhados pelo mundo. Cada PoP tem servidores que fazem cache e atendem requisições. O **origin** é o seu servidor (ou bucket S3, etc.) de onde a CDN busca o conteúdo em **cache miss**.

O **DNS** do seu domínio (ex.: \`cdn.seudominio.com\`) é configurado para resolver para a CDN; a CDN roteia a requisição para o **PoP mais adequado** (por geolocalização do cliente) e esse PoP busca da origin se necessário.

Na **configuração** você define: TTL por tipo de arquivo ou path, regras de cache (por cookie, header), SSL, compressão (gzip/brotli), e opcionalmente image optimization, HTTP/2 ou HTTP/3. Provedores comuns: **Cloudflare**, **AWS CloudFront**, **Fastly**, **Akamai**, **Azure CDN**, **Google Cloud CDN**. Em system design, a CDN aparece como a **primeira camada** para conteúdo estático.`,
  },
]

const stepsByLesson: Record<string, Step[]> = {
  'load-balancer': loadBalancerSteps,
  cache: cacheSteps,
  database: databaseSteps,
  microservices: microservicesSteps,
  cdn: cdnSteps,
}

export function getStepsForLesson(lessonId: string): Step[] {
  return stepsByLesson[lessonId] ?? []
}
