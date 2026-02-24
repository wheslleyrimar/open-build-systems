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

Em entrevistas de system design e na prática, o load balancer costuma aparecer na **primeira camada** atrás do cliente: o usuário acessa um endereço (ou DNS), que resolve para o IP do load balancer; este escolhe qual instância do seu serviço vai atender aquela requisição. Assim você escala **horizontalmente**: adiciona mais máquinas e o balanceador distribui o trabalho.

**Exemplo de escala**: um único servidor web pode atender talvez 1.000–5.000 requisições por segundo (RPS) dependendo da aplicação. Com 10 servidores atrás de um load balancer, você pode atingir 10.000–50.000 RPS, e o balanceador fica responsável por distribuir cada requisição para um dos 10 nós. Empresas como **Netflix** e **Amazon** usam milhares de instâncias atrás de múltiplas camadas de balanceamento (global, regional e por serviço).`,
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

Em arquiteturas de **microsserviços**, cada serviço pode ter seu próprio load balancer ou você usa um **API Gateway** que já faz esse papel. Em **Kubernetes**, o Service (ClusterIP/NodePort/LoadBalancer) e os **Ingress controllers** (NGINX, Traefik, etc.) cumprem a função de balanceamento.`,
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
  {
    title: 'Exemplo real: tráfego e números',
    content: `**Cenário típico de e-commerce em Black Friday**:
- Tráfego sobe de 2.000 RPS para 50.000 RPS em pico.
- Sem load balancer: um único servidor cairia em segundos (CPU, memória, conexões).
- Com pool de 20 servidores + LB: cada um recebe ~2.500 RPS; o LB faz health check a cada 10 s e remove nós que não respondem em 5 s.
- Se 2 nós caírem, os 18 restantes absorvem a carga (~2.777 RPS cada); o usuário pode notar um leve aumento de latência, mas o site continua no ar.

**Sticky session em prática**: em aplicações que guardam sessão em memória (ex.: carrinho antes de persistir no banco), o mesmo cliente precisa sempre cair no mesmo backend. Configure o LB para usar **cookie** (ex.: \`JSESSIONID\`) ou **IP Hash**. No AWS ALB, ative "Stickiness" com duração de 1 dia; o primeiro request recebe um cookie e os próximos são enviados ao mesmo target. Se esse target cair, o próximo request vai para outro e a sessão em memória se perde — por isso o ideal é persistir sessão em Redis ou banco quando for crítico.`,
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

**Trade-off**: complexidade de **invalidação** e **consistência** — o cache pode ficar desatualizado se os dados na origem mudarem e o cache não for atualizado ou expirado.

**Exemplo de impacto**: uma API que busca o perfil do usuário no banco leva ~15 ms por request. Com Redis na frente (hit ~0,5 ms), a mesma API pode servir 10x mais requisições por segundo no mesmo hardware, e a latência percebida pelo usuário cai drasticamente. Em redes sociais (ex.: timeline), a maior parte das leituras é servida por cache; o banco fica reservado para escritas e leituras que não cabem no cache.`,
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
  {
    title: 'Cache stampede e como evitar',
    content: `**Cache stampede** ocorre quando uma chave **expira** (ou é invalidada) e **muitas requisições** chegam ao mesmo tempo. Todas fazem **miss**, todas vão ao banco e todas tentam popular o cache — o banco recebe um pico de dezenas ou centenas de queries idênticas em milissegundos, podendo derrubar o serviço.

**Soluções**:
1. **Lock distribuído (mutex)**: a primeira requisição que der miss adquire um lock (ex.: \`SET lock:user:123 NX EX 10\` no Redis); as outras esperam ou retornam um valor em cache "stale" se houver. Quem tem o lock busca do banco, popula o cache e libera o lock.
2. **Probabilistic early expiration (beta)**: antes do TTL expirar, com probabilidade proporcional ao tempo restante, uma requisição "renova" o cache em background. Reduz a chance de muitas requisições expirarem ao mesmo tempo.
3. **TTL aleatório (jitter)**: em vez de TTL fixo de 300 s, use 300 + random(0, 60); assim as expirações se espalham no tempo.

**Exemplo com lock em Redis** (pseudocódigo):

\`\`\`python
def get_user_with_lock(user_id):
    data = redis.get(f"user:{user_id}")
    if data:
        return deserialize(data)
    lock_key = f"lock:user:{user_id}"
    if redis.set(lock_key, "1", nx=True, ex=10):
        try:
            user = db.get_user(user_id)
            redis.setex(f"user:{user_id}", 300, serialize(user))
            return user
        finally:
            redis.delete(lock_key)
    time.sleep(0.1)
    return get_user_with_lock(user_id)  # retry
\`\`\``,
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
- **Assíncrona**: o primário confirma e as réplicas recebem as mudanças depois. Mais comum em alta throughput; aceita **replication lag** e **consistência eventual**.

**Exemplo**: PostgreSQL com 1 primário e 2 réplicas. Escritas (INSERT/UPDATE) vão só ao primário; o WAL é enviado às réplicas. Leituras de relatórios e listagens podem usar \`SELECT ... FROM read_replica\`; o primário fica livre para transações críticas. Em MySQL, o mesmo com réplicas de leitura; em AWS RDS você cria Read Replicas na mesma região ou em outra para reduzir latência global.`,
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
  {
    title: 'Exemplo real: Instagram e sharding por user_id',
    content: `**Caso de uso**: uma rede social com bilhões de usuários. A tabela de fotos (ou posts) não cabe em um único banco e a escrita é intensa.

**Estratégia**: sharding por \`user_id\`. Cada usuário tem suas fotos sempre no **mesmo shard**. Assim:
- "Listar fotos do usuário X" → uma única query no shard de X.
- "Publicar nova foto" → escrita no shard de X.
- Não há necessidade de join entre shards para o caso principal (timeline do próprio usuário).

**Timeline de outros usuários** (feed): é uma query que precisa de dados de **vários** usuários (quem eu sigo). Duas abordagens comuns: (1) **Fan-out on write**: ao publicar, a foto é escrita nas "caixas de entrada" de cada seguidor (tabelas por user_id do seguidor); assim ler o feed é uma query em um shard, mas escrever é caro (muitos seguidores = muitas escritas). (2) **Fan-out on read**: ao abrir o feed, a aplicação consulta os N usuários que eu sigo (pode ser em paralelo em vários shards), agrega e ordena. Escrita barata, leitura mais pesada. Instagram e Twitter usam variações desses modelos e cache pesado no meio.`,
  },
]

export const microservicesSteps: Step[] = [
  {
    title: 'Definição e princípios',
    content: `**Microsserviços** é um estilo de arquitetura em que o sistema é composto por **vários serviços pequenos e independentes**. Cada serviço:

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
    content: `O **API Gateway** é o **ponto de entrada único** para os clientes: roteia requisições para o microsserviço correto, pode fazer **autenticação/autorização**, **rate limiting** e agregar respostas de vários serviços (padrão **BFF — Backend for Frontend**). Assim os clientes não precisam conhecer cada serviço.

**Entre os microsserviços**:
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
  {
    title: 'Saga: transações distribuídas sem 2PC',
    content: `Em um monolito, você usa **transação ACID**: debitar estoque, criar pedido e cobrar pagamento na mesma transação; se algo falhar, tudo dá rollback. Em microsserviços, cada operação está em um **serviço e banco diferentes** — não há transação global.

**Saga** é um padrão para orquestrar uma sequência de passos onde cada passo pode **compensar** (undo) se um passo posterior falhar. Exemplo "Criar pedido":
1. **Pedidos**: cria o pedido (status = PENDING).
2. **Estoque**: reserva itens. Se falhar → compensação: cancela o pedido.
3. **Pagamento**: cobra o cartão. Se falhar → compensação: libera estoque, cancela pedido.
4. **Pedidos**: atualiza status para CONFIRMED.

Cada serviço expõe uma ação e uma **compensação** (ex.: \`reserveStock\` / \`releaseStock\`). A orquestração (um serviço de orquestrador ou um fluxo em mensageria) chama os passos em ordem; em falha, executa as compensações na ordem **inversa**. **Desvantagem**: janelas de inconsistência (estoque reservado mas pagamento falhou até a compensação rodar). Por isso sagas exigem **idempotência** e **monitoramento** para detectar sagas travadas e executar compensações manuais se necessário.`,
  },
  {
    title: 'Exemplo de escala: Netflix e Amazon',
    content: `**Netflix**: centenas de microsserviços — catálogo, reprodução, recomendações, billing, CDN selection, etc. Cada time dono de um serviço faz deploy independente (dezenas de deploys por dia). A API de reprodução agrega dados de vários serviços (metadados, stream URL, legendas); se um deles estiver lento, circuit breaker e fallback evitam que a tela inteira quebre. Recomendações são calculadas em batch e servidas por cache; o serviço de recomendações não é chamado em tempo real em toda reprodução.

**Amazon**: a página de um produto agrega preço (serviço de preços), estoque (serviço de inventário), avaliações (serviço de reviews), "comprados juntos" (serviço de recomendação). Cada um é um serviço com múltiplas instâncias. O "Add to Cart" pode disparar eventos para estoque, recomendação e analytics sem bloquear a resposta ao usuário. Escala por serviço: em Black Friday o serviço de pedidos ganha mais instâncias; o de reviews não necessariamente.`,
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
  {
    title: 'Streaming de vídeo e adaptive bitrate',
    content: `Para **vídeo** (YouTube, Netflix, Twitch), a CDN não entrega um arquivo único de 2 GB; entrega **segmentos** (chunks de alguns segundos) em diferentes **qualidades** (bitrates). O player escolhe dinamicamente qual qualidade baixar conforme a banda disponível — é o **adaptive bitrate** (ABR): em conexão lenta, baixa 480p; em fibra, 4K. Os segmentos são arquivos estáticos (ex.: \`.m3u8\` + \`.ts\` em HLS, ou \`.mpd\` + segmentos em DASH), então a CDN cacheia cada um nos PoPs. Um vídeo popular é servido da borda para milhões de usuários sem sobrecarregar a origin.

**Números**: um evento ao vivo com 1 milhão de espectadores em 1080p (~5 Mbps) seria 5 Tbps de saída da origin sem CDN; com CDN, a maior parte do tráfego é entre o PoP e o usuário, e a origin só envia o stream uma vez (ou poucas vezes) para cada PoP.`,
  },
  {
    title: 'Invalidação e cache busting na prática',
    content: `**Problema**: você atualizou o CSS e o JS do site, mas os usuários ainda veem a versão antiga porque a CDN (e o browser) estão servindo do cache.

**Cache busting por URL**: em vez de \`/assets/app.js\`, use \`/assets/app.a1b2c3d4.js\` (hash do conteúdo no nome do arquivo). Ao fazer deploy, o nome do arquivo muda; a CDN e o browser tratam como recurso novo e baixam. Não é necessário invalidar manualmente. Build tools (Vite, Webpack) fazem isso automaticamente.

**Invalidação manual (purge)**: quando você **não** controla o nome da URL (ex.: \`/noticias/ultima\`), precisa invalidar na CDN após atualizar. No CloudFront: \`create-invalidation --paths "/noticias/*"\`. No Cloudflare: purge por URL ou purge everything. **Custo**: muitas CDNs cobram por invalidação (ex.: primeiras 1.000 paths grátis por mês); abuse pode esvaziar o cache e aumentar carga na origin. Use purge com critério; prefira versionamento na URL quando possível.`,
  },
]

// --- Novos componentes (conteúdo aprofundado) ---
export const messageQueueSteps: Step[] = [
  {
    title: 'O que é Message Queue?',
    content: `**Filas de mensagens** (Kafka, RabbitMQ, Amazon SQS, Azure Service Bus) são sistemas que **desacoplam produtores e consumidores** de dados. O **produtor** envia mensagens para uma **fila** ou **tópico**; um ou mais **consumidores** processam essas mensagens de forma **assíncrona**, em seu próprio ritmo.

**Benefícios principais**: (1) **Absorver picos**: o produtor pode enviar em rajadas enquanto o consumidor processa em velocidade estável; (2) **Retry e garantias de entrega**: mensagens podem ser persistidas e reprocessadas em caso de falha; (3) **Desacoplamento**: produtor e consumidor não precisam estar online ao mesmo tempo nem conhecer a implementação um do outro; (4) **Escalabilidade**: adicionar mais consumidores aumenta o throughput de processamento.

Use filas para: processamento em background (envio de e-mail, geração de relatórios), eventos entre microserviços, pipeline de dados (ETL), buffer entre sistemas com latências diferentes. **Evite** para fluxos que exigem resposta síncrona imediata ao usuário — nesses casos, chame o serviço diretamente.`,
  },
  {
    title: 'Padrões: Fila vs Pub/Sub vs Kafka',
    content: `**Fila (queue)**  
Cada mensagem é consumida por **um único** consumidor (competing consumers). Vários consumidores disputam as mensagens; quando um pega a mensagem, ela sai da fila (ou fica invisível até o ack). Ex.: RabbitMQ em modo queue, SQS. Ideal quando cada trabalho deve ser feito uma vez.

**Pub/Sub (tópico)**  
Cada mensagem é entregue a **todos** os assinantes do tópico. Um publicador envia para um canal; N assinantes recebem a mesma mensagem. Ex.: Redis Pub/Sub, AWS SNS, Google Pub/Sub. Ideal para broadcast (notificações, eventos de domínio para vários sistemas).

**Kafka (log particionado)**  
Mensagens são organizadas em **partições** dentro de um tópico. Cada partição é um log ordenado. **Consumer groups**: cada mensagem de uma partição é consumida por **um** consumidor do group (como uma fila por partição). Diferentes groups recebem todas as mensagens (como Pub/Sub). Ordenação é garantida **dentro** de uma partição (por chave). Retention configurável (horas ou dias).`,
  },
  {
    title: 'Garantias de entrega e idempotência',
    content: `**At-least-once**  
A mensagem pode ser **entregue mais de uma vez** (ex.: consumidor processa e falha antes de fazer ack; a mensagem volta para a fila). O consumidor deve ser **idempotente**: processar a mesma mensagem duas vezes não deve causar efeito colateral duplicado (ex.: debitar duas vezes o saldo). Estratégias: checar ID antes de inserir, usar chave única no banco, ou operações idempotentes por natureza.

**Exactly-once**  
Mais complexo. Em Kafka: transações do produtor + processamento idempotente + commit transacional do consumer. Em SQS: FIFO queues + deduplicação por \`MessageDeduplicationId\` em janela de 5 min. Nem todo sistema suporta exactly-once de ponta a ponta; muitas arquiteturas assumem at-least-once + idempotência no consumidor.

**Dead Letter Queue (DLQ)**  
Mensagens que falham após N tentativas podem ser enviadas para uma fila separada (DLQ) para inspeção, retry manual ou alerta. Evita que mensagens problemáticas fiquem bloqueando o consumo.`,
  },
  {
    title: 'Exemplo: producer e consumer com SQS',
    content: `Pseudocódigo de envio (produtor) e consumo (consumidor) com AWS SQS:

\`\`\`python
# Produtor
sqs.send_message(
    QueueUrl=queue_url,
    MessageBody=json.dumps({"order_id": "123", "user_id": "u1"}),
    MessageGroupId="orders"  # FIFO
)

# Consumidor (polling)
while True:
    messages = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10)
    for msg in messages:
        try:
            process(msg["Body"])
            sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=msg["ReceiptHandle"])
        except Exception:
            # mensagem volta a ficar visível após visibility timeout
            pass
\`\`\`

**Visibility timeout**: após receber a mensagem, ela fica invisível para outros consumidores por um tempo; se não for deletada (ack), volta a ficar visível. Ajuste conforme o tempo médio de processamento.`,
  },
  {
    title: 'Quando usar e trade-offs',
    content: `**Quando usar**: integração assíncrona entre sistemas, processamento em background, eventos que vários serviços precisam consumir (com Kafka ou Pub/Sub), buffer para picos de carga.

**Trade-offs**: (1) **Consistência eventual** — o consumidor processa depois; não há resposta síncrona. (2) **Complexidade operacional** — monitorar lag, DLQ, particionamento. (3) **Ordenação** — em filas distribuídas, ordenação total é difícil; use particionamento por chave (Kafka) se precisar de ordem por partição. (4) **Custo** — mensageria gerenciada (SQS, SNS, Kafka em cloud) tem custo por mensagem ou throughput.`,
  },
  {
    title: 'Exemplo: Kafka e partições por chave',
    content: `No **Kafka**, um tópico é dividido em **partições**. Cada mensagem tem uma **chave** (opcional). Mensagens com a mesma chave vão para a **mesma partição**, garantindo **ordem** para essa chave. Exemplo: evento "clique no carrinho" com \`user_id\` como chave. Todos os eventos de um mesmo usuário ficam na mesma partição e são consumidos na ordem em que foram produzidos.

\`\`\`python
# Produtor (conceitual)
producer.send(
    topic="user-events",
    key=user_id,           # particionamento por user_id
    value={"action": "add_to_cart", "product_id": "p123"}
)
\`\`\`

**Consumer group**: você roda 5 instâncias do consumidor no mesmo group. Cada partição é atribuída a **um** consumidor do group. Se o tópico tem 10 partições, cada consumidor processa 2 partições. Se uma instância cair, as partições são redistribuídas. **Throughput**: mais partições = mais paralelismo; mas muitas partições aumentam overhead de metadados e rebalanceamento. Número típico: entre número de consumidores e 2–3x.`,
  },
  {
    title: 'Dead Letter Queue e retry em produção',
    content: `**Fluxo típico**: mensagem é consumida; o consumidor tenta processar (ex.: chamar API de pagamento); falha (timeout, 5xx). A mensagem **não** é removida da fila (não há ack); após o **visibility timeout** (SQS) ou **commit** não enviado (Kafka), a mensagem fica disponível de novo e outro consumidor (ou o mesmo) tenta de novo. Após **N tentativas** (ex.: 3), a mensagem é enviada para a **Dead Letter Queue (DLQ)**.

**Por que DLQ**: evita que uma mensagem "envenenada" (dados inválidos que sempre falham) fique em loop infinito e bloqueie o consumo das demais. Na DLQ você pode: (1) inspecionar a mensagem e corrigir dados ou código; (2) republicar na fila principal após correção; (3) alertar o time; (4) arquivar para análise. **Boas práticas**: monitore o tamanho da DLQ; crescimento contínuo indica bug ou dependência instável. Configure alertas e processo de triagem (runbook) para esvaziar a DLQ.`,
  },
]

export const apiGatewaySteps: Step[] = [
  {
    title: 'O que é API Gateway?',
    content: `O **API Gateway** é o **ponto de entrada único** para as APIs expostas ao cliente (web, mobile, parceiros). Em vez de o cliente chamar cada microserviço diretamente (e precisar conhecer dezenas de URLs e credenciais), ele chama **um** endpoint; o gateway **roteia** a requisição para o serviço backend correto, com base em path, host ou headers.

Além do roteamento, o gateway centraliza **cross-cutting concerns**: **autenticação e autorização** (validar JWT, API key, OAuth), **rate limiting** (limitar requisições por cliente), **SSL termination** (terminar TLS no gateway), **transformação** de request/response (agregação, versionamento), **logging e métricas** na borda. O cliente não precisa saber quantos serviços existem atrás; o gateway abstrai a topologia interna.`,
  },
  {
    title: 'Responsabilidades em detalhe',
    content: `**Roteamento**  
\`/api/users\` → serviço de usuários; \`/api/orders\` → serviço de pedidos; \`/graphql\` → Apollo Router ou serviço GraphQL. Pode ser por path, por host (\`users.empresa.com\`) ou por header. Em Kubernetes, o Ingress faz esse papel para HTTP; um API Gateway pode ficar na frente do Ingress ou substituí-lo.

**Autenticação e autorização**  
Validar token JWT no gateway; extrair \`user_id\` e repassar em header (\`X-User-Id\`) para os backends. Assim os backends não precisam validar token em toda requisição. API keys para parceiros; OAuth2 para delegação. Se a requisição não estiver autenticada, o gateway retorna 401 sem chamar o backend.

**Rate limiting**  
Limitar quantas requisições um IP ou usuário pode fazer por minuto; retornar 429 ao exceder. Protege os backends de abuso e permite oferecer tiers (free vs premium por limite diferente).

**BFF (Backend for Frontend)**  
Um gateway pode **agregar** várias chamadas a microserviços em uma única resposta otimizada para o cliente (ex.: uma tela precisa de user + orders + notifications; o BFF chama os três e monta o JSON). Reduz round-trips do cliente.`,
  },
  {
    title: 'Exemplos de produtos',
    content: `**AWS API Gateway**: serviço gerenciado; integra com Lambda, HTTP backends, WebSocket. Cobrança por requisição. **Kong**: open-source e comercial; plugins para auth, rate limit, logging; pode rodar on-premise ou em Kubernetes. **Apollo Router** (GraphQL): gateway para federated GraphQL. **Envoy**: proxy de alta performance; usado como sidecar (Istio) ou como gateway; configuração por config estática ou xDS. **Traefik**: muito usado em Kubernetes como Ingress; suporta middlewares (auth, rate limit).

Em ambientes **Kubernetes**, é comum usar **Ingress** (NGINX Ingress, Traefik Ingress) com anotações para auth e rate limit, ou um API Gateway dedicado (Kong Ingress, Ambassador) que faz o mesmo com mais recursos.`,
  },
  {
    title: 'Trade-offs e boas práticas',
    content: `**Vantagens**: um único lugar para auth, rate limit, roteamento; clientes simplificados; backends não expostos diretamente à internet.

**Desvantagens**: o gateway vira **ponto crítico** — se cair, nada é acessível; precisa ser altamente disponível (múltiplas instâncias, health checks). Pode virar **gargalo** se toda a lógica pesada (agregação, transformação) estiver nele; prefira fazer agregação em um serviço BFF dedicado e manter o gateway enxuto.

**Boas práticas**: (1) Não coloque **lógica de negócio** no gateway; apenas roteamento, auth e throttling. (2) Versionamento de API: \`/v1/users\`, \`/v2/users\`; o gateway roteia para a versão correta do backend. (3) Circuit breaker e timeouts no gateway para não segurar conexões indefinidamente quando um backend está lento.`,
  },
  {
    title: 'Exemplo: Kong e validação de JWT',
    content: `No **Kong**, você configura um **Service** (backend) e uma **Route** (path). Depois anexa **plugins**. Exemplo de rota que exige JWT:

\`\`\`yaml
services:
  - name: user-service
    url: http://users-api:8080
routes:
  - name: user-route
    paths: ["/api/users"]
    service: user-service
plugins:
  - name: jwt
    config:
      key_claim_name: iss
      secret_is_base64: false
  - name: rate-limiting
    config:
      minute: 100
      policy: local
\`\`\`

O cliente envia \`Authorization: Bearer <JWT>\`. O Kong valida a assinatura e expiração do JWT; se inválido, retorna 401 sem chamar o backend. Se válido, pode injetar claims no header (ex.: \`X-User-Id\`) e repassar ao backend. O backend não precisa validar JWT em toda requisição — confia no gateway. Para **BFF**: uma rota \`/api/dashboard\` pode chamar um serviço BFF que internamente chama user, orders e notifications e agrega a resposta.`,
  },
]

export const rateLimitingSteps: Step[] = [
  {
    title: 'O que é Rate Limiting?',
    content: `**Rate limiting** (limitação de taxa) restringe **quantas requisições** um cliente pode fazer em um determinado intervalo — por exemplo, 100 requisições por minuto por IP, ou 1000 por hora por \`user_id\` após autenticação. Os objetivos são: **proteger o backend** de abuso (DDoS, scraping, brute force), **garantir uso justo** entre usuários (um cliente não pode consumir toda a capacidade), **controlar custos** (APIs de terceiros cobram por uso) e **melhorar a experiência** (evitar que um usuário derrube o serviço para todos).

O rate limiting é tipicamente implementado no **API Gateway**, no **load balancer** ou na **aplicação** (middleware). Em sistemas distribuídos, o estado do contador precisa ser compartilhado — por exemplo, em **Redis** — para que o limite seja aplicado globalmente mesmo com várias instâncias do gateway.`,
  },
  {
    title: 'Algoritmos clássicos',
    content: `**Token bucket**  
Um "balde" tem um número máximo de tokens; tokens são repostos a uma **taxa fixa** (ex.: 10 por segundo). Cada requisição consome um token. Se não houver tokens, a requisição é rejeitada. Permite rajadas curtas (burst) até o tamanho do balde, depois estabiliza na taxa de reposição.

**Leaky bucket**  
As requisições "entram" em um balde; saem (são processadas) a uma **taxa constante** (como um vazamento). Suaviza picos; não permite burst tão grande. Muito usado em telecomunicações.

**Fixed window**  
Conta requisições em janelas de tempo **fixas** (ex.: das 10:00:00 às 10:01:00). Simples, mas pode haver "spike" no limite no início de cada janela (ex.: 100 req no último segundo de uma janela + 100 no primeiro segundo da próxima = 200 em 2 segundos).

**Sliding window**  
A janela "desliza" com o tempo (ex.: últimos 60 segundos a partir de agora). Mais justo; implementação um pouco mais complexa (Redis com sorted set por timestamp). **Sliding window log** guarda timestamps das requisições e descarta as fora da janela.`,
  },
  {
    title: 'Estratégias e resposta ao cliente',
    content: `**Por quem limitar**  
- **Por IP**: simples, mas um NAT pode compartilhar muitos usuários.  
- **Por user_id** (após login): mais justo; requer que a requisição já esteja autenticada.  
- **Por API key**: para parceiros ou planos (free vs premium com limites diferentes).  
- **Por endpoint**: alguns endpoints podem ter limites mais baixos (ex.: busca pesada).

**Resposta ao exceder**  
Código HTTP **429 Too Many Requests**. Headers úteis: \`X-RateLimit-Limit\` (limite total), \`X-RateLimit-Remaining\` (quantas restam), \`X-RateLimit-Reset\` ou \`Retry-After\` (quando o cliente pode tentar de novo). O corpo da resposta pode incluir uma mensagem amigável e um link para upgrade de plano.`,
  },
  {
    title: 'Exemplo com Redis (fixed window)',
    content: `Implementação conceitual de rate limit **fixed window** com Redis:

\`\`\`python
key = f"ratelimit:{user_id}:{minute_timestamp}"  # ex.: ratelimit:u123:1640000060
current = redis.incr(key)
if current == 1:
    redis.expire(key, 120)  # expira em 2 min para não acumular chaves
if current > LIMIT_PER_MINUTE:
    return 429, {"error": "Too many requests", "retry_after": 60}
\`\`\`

Para **sliding window** com Redis: use um **sorted set** onde o score é o timestamp; adicione cada requisição com \`ZADD key timestamp timestamp\`; remova elementos com score menor que (now - window); \`ZCARD\` é o número de requisições na janela. Compare com o limite e retorne 429 ou permita.`,
  },
  {
    title: 'Exemplo real: tiers e documentação da API',
    content: `**Planos típicos**: Free = 100 req/min; Pro = 1.000 req/min; Enterprise = 10.000 req/min. O limite é aplicado por **API key** (cada cliente tem uma chave associada a um plano). O gateway consulta a key, identifica o plano e aplica o limite correspondente. Headers de resposta ajudam o cliente a se comportar bem:

\`\`\`http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1640000120
\`\`\`

\`Reset\` é o Unix timestamp do fim da janela atual. O cliente pode esperar até esse momento antes de fazer nova leva de requests, ou implementar **backoff** quando receber 429 (ex.: esperar \`Retry-After\` segundos). **Documentação**: na OpenAPI/Swagger, indique os limites por endpoint e o que o cliente deve fazer ao receber 429 (retry, mensagem amigável, link para upgrade). Isso reduz suporte e reclamações de desenvolvedores que integram à sua API.`,
  },
]

export const serviceDiscoverySteps: Step[] = [
  {
    title: 'O que é Service Discovery?',
    content: `Em ambientes **dinâmicos** — Kubernetes, containers, autoscaling — as **instâncias** dos serviços mudam frequentemente de **IP e porta**. Pods sobem e descem; máquinas são substituídas. Se o cliente (outro serviço ou um load balancer) tiver o IP fixo de uma instância, ela pode estar morta ou ter mudado. **Service discovery** resolve o problema: o cliente precisa descobrir **onde** está o serviço "users" ou "orders" em tempo de execução.

Dois lados: **registro** (cada instância se registra quando sobe e se desregistra quando desce) e **descoberta** (o cliente consulta "quais são os endpoints do serviço X?" e obtém uma lista de instâncias saudáveis). O registry pode fazer **health checks** e remover instâncias que não respondem.`,
  },
  {
    title: 'Client-side vs Server-side discovery',
    content: `**Client-side discovery**  
O **cliente** consulta um **registry** (Consul, etcd, Eureka, ZooKeeper) para obter a lista de instâncias do serviço desejado. O cliente escolhe uma instância (round-robin, random, least loaded) e chama diretamente. Vantagem: uma chamada a menos (não passa por um proxy). Desvantagem: o cliente precisa implementar a lógica de descoberta e de seleção; cada linguagem/cliente precisa de uma lib.

**Server-side discovery**  
O cliente chama um **load balancer** ou **proxy** com um nome estável (ex.: \`users.service.consul\` ou \`users.default.svc.cluster.local\`). O load balancer (ou o que resolve esse nome) já sabe onde estão as instâncias e faz o roteamento. O cliente não precisa saber nada. Ex.: **Kubernetes Service**: o nome DNS do Service resolve para os IPs dos Pods; kube-proxy ou o Ingress fazem o encaminhamento.`,
  },
  {
    title: 'Registro e health checks',
    content: `As instâncias **se registram** ao iniciar: enviam ao registry o nome do serviço, IP, porta e metadados (versão, região). Ao encerrar (graceful shutdown), **desregistram**. O registry pode também fazer **health checks** ativos (HTTP ou TCP) nas instâncias; se uma falhar N vezes, é removida da lista. Assim os clientes só obtêm instâncias **saudáveis**.

**Consul**, **etcd**, **ZooKeeper**, **Eureka** são usados como registry em ambientes que não são puramente Kubernetes. Em **Kubernetes**, o próprio control plane mantém o estado dos Pods e Services; o **Service** é o recurso de discovery nativo: você não precisa rodar um Consul separado para serviços dentro do cluster.`,
  },
  {
    title: 'Kubernetes Service em prática',
    content: `No Kubernetes, você cria um **Service** apontando para Pods via **selector** (labels). O Service tem um nome DNS estável, por exemplo \`users.default.svc.cluster.local\`. Qualquer Pod no cluster pode resolver esse nome e receber um IP (ou vários, dependendo do tipo de Service); o kube-proxy encaminha o tráfego para os Pods que batem com o selector.

Para expor para fora do cluster: **LoadBalancer** ou **NodePort** ou **Ingress**. O Ingress pode rotear por host/path para diferentes Services. Assim, service discovery no K8s é "server-side": você usa o nome do Service e o sistema resolve e balanceia. Não é necessário manter uma lista manual de IPs.`,
  },
  {
    title: 'Exemplo: Consul e registro de serviço',
    content: `Em ambientes **fora do Kubernetes** (VMs, múltiplos datacenters), **Consul** é um registry popular. Cada instância do seu serviço **registra-se** ao subir:

\`\`\`json
PUT /v1/agent/service/register
{
  "ID": "users-1",
  "Name": "users",
  "Address": "10.0.1.5",
  "Port": 8080,
  "Check": {
    "HTTP": "http://10.0.1.5:8080/health",
    "Interval": "10s"
  }
}
\`\`\`

Outros serviços ou o load balancer consultam \`GET /v1/catalog/service/users\` e recebem a lista de instâncias saudáveis. O Consul faz health check; se \`users-1\` parar de responder, é removido do catálogo. **Consul Connect** adiciona mTLS entre serviços. Alternativa: **HashiCorp Nomad** com Consul para discovery em jobs; ou **etcd** + custom logic para registro e descoberta.`,
  },
]

export const circuitBreakerSteps: Step[] = [
  {
    title: 'O que é Circuit Breaker?',
    content: `O **circuit breaker** é um padrão de **resiliência** que evita que um cliente fique chamando um serviço **que está falhando** repetidamente. Sem o padrão: cada requisição tenta o serviço remoto, espera o timeout (ex.: 30 s), falha, e o próximo cliente faz a mesma coisa. O serviço doente continua recebendo carga, e os usuários sofrem latência alta até o timeout.

Com o circuit breaker: após **N falhas consecutivas** (ou uma taxa de falha alta), o circuito **abre**. Enquanto aberto, as chamadas **não vão** ao serviço remoto — falham imediatamente com um fallback (resposta em cache, erro amigável) ou exceção. Depois de um **timeout** (ex.: 30 s), o circuito passa para **half-open**: uma chamada de teste é permitida. Se sucesso, o circuito **fecha** (volta ao normal); se falha, reabre. Assim você **reduz carga** no serviço doente e **falha rápido** para o usuário.`,
  },
  {
    title: 'Estados do circuito',
    content: `**Closed (fechado)**  
Chamadas passam normalmente para o serviço remoto. Falhas são contadas; sucessos resetam o contador (dependendo da implementação).

**Open (aberto)**  
Chamadas **não** são enviadas ao serviço. Retornam imediatamente com fallback ou exceção. Após um tempo configurável (**sleep window**), o circuito passa para half-open.

**Half-open (meio-aberto)**  
Permite **uma** (ou poucas) chamada(s) de "teste". Se der sucesso, o circuito **fecha**. Se falhar, **reabre** e o sleep window recomeça. Objetivo: verificar se o serviço voltou sem inundá-lo de tráfego.

Parâmetros típicos: **failure threshold** (quantas falhas para abrir), **success threshold** (quantos sucessos em half-open para fechar), **sleep window** (tempo em open antes de half-open).`,
  },
  {
    title: 'Implementação e integração',
    content: `Bibliotecas populares: **Resilience4j** (Java), **Polly** (.NET), **go-breaker** ou **opencensus** (Go). Em Node, **opossum**. Você envolve a chamada HTTP (ou gRPC) com o circuit breaker; a lib mantém o estado e decide se chama ou não.

Use junto com **retry** (com backoff exponencial) para falhas transitórias: primeiro tenta de novo algumas vezes; se continuar falhando, o circuit breaker abre. E use **fallback**: quando o circuito está open (ou quando há exceção), retorne uma resposta alternativa — por exemplo, dados em cache, uma mensagem "serviço temporariamente indisponível", ou um valor default. Assim o usuário não fica sem resposta.`,
  },
  {
    title: 'Quando usar',
    content: `Use circuit breaker **sempre que** um serviço chama outro (HTTP, gRPC, cliente de fila). Em **microserviços**, é essencial: a falha de um serviço não deve derrubar todos os que dependem dele; o circuit breaker contém a falha e permite fallback.

**Não** substitui health checks nem corrige o serviço doente; ele apenas **protege** o chamador e o sistema como um todo de cascata de falhas e timeouts longos. Monitore quantas vezes o circuito abre e por quanto tempo; isso indica problemas no serviço downstream.`,
  },
  {
    title: 'Exemplo: Resilience4j com fallback',
    content: `Em **Java**, com **Resilience4j**, você configura o circuit breaker e um fallback:

\`\`\`java
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .slidingWindowSize(10)
    .build();

CircuitBreaker cb = CircuitBreaker.of("recommendations", config);

Supplier<Recommendations> decorated = CircuitBreaker
    .decorateSupplier(cb, () -> recommendationsClient.get(userId));

Recommendations result = Try.ofSupplier(decorated)
    .recover(throwable -> getCachedOrDefault(userId))
    .get();
\`\`\`

Quando o circuito abre, \`getCachedOrDefault(userId)\` é chamado em vez do cliente — por exemplo, retorna recomendações em cache ou uma lista default. O usuário recebe algo útil em vez de erro 503 ou timeout de 30 s. Em **Go**, bibliotecas como **sony/gobreaker** oferecem API similar; em **Node**, **opossum** com \`fallback\`.`,
  },
]

export const consistentHashingSteps: Step[] = [
  {
    title: 'O que é Consistent Hashing?',
    content: `**Consistent hashing** é um esquema de **distribuição de chaves** entre **nós** (servidores de cache, partições de um broker, shards) de forma que, ao **adicionar ou remover** um nó, apenas uma **fração** das chaves precise ser remapeada — idealmente 1/N das chaves quando N é o número de nós.

No **hashing modular** (key % N), a chave é atribuída ao nó \`hash(key) % N\`. O problema: quando N muda (novo servidor ou um cai), **quase todas** as chaves mudam de nó. Em um cache distribuído, isso causaria um **cache stampede** (quase todo mundo vira miss). Em sharding, rebalancear seria muito custoso. O consistent hashing minimiza o remapeamento.`,
  },
  {
    title: 'Como funciona o anel',
    content: `Chaves e nós são mapeados para um **anel** (círculo) de hash. O espaço de hash (ex.: 0 a 2^32-1) é tratado como circular. Cada **nó** ocupa um ou mais pontos no anel (seu hash, ou múltiplos hashes no caso de virtual nodes). Cada **chave** pertence ao primeiro nó encontrado no **sentido horário** a partir do hash da chave.

Ao **adicionar** um nó: apenas as chaves que ficam entre o nó anterior (no sentido horário) e o novo nó mudam para o novo nó. Ao **remover** um nó: apenas as chaves daquele nó são redistribuídas para o próximo nó no anel. A quantidade de chaves remapeadas é da ordem de 1/N. **Virtual nodes (vnodes)**: cada nó físico é representado por várias posições no anel (ex.: 100 réplicas por nó); isso torna a distribuição **mais uniforme** e evita que um nó receba desproporcionalmente mais chaves (hot spot).`,
  },
  {
    title: 'Uso em System Design',
    content: `**Cache distribuído** (ex.: Redis Cluster, Memcached com consistent hashing): qual servidor de cache guarda qual chave; ao adicionar um novo cache, só uma fração das chaves migra; o restante continua hit. **Sharding de dados**: DynamoDB, Cassandra usam consistent hashing (ou variantes) para decidir em qual partição/shard cada chave vai. **Load balancing**: sticky session com mínimo remapeamento quando o número de servidores muda. **CDN**: algumas implementações usam consistent hashing para rotear conteúdo para o edge mais próximo.

Em entrevistas de system design, consistent hashing aparece quando se fala em "como distribuir chaves entre N nós de forma que adicionar/remover nós não cause remapeamento massivo".`,
  },
  {
    title: 'Trade-offs',
    content: `**Vantagem**: remapeamento mínimo ao escalar (adicionar/remover nós). **Desvantagem**: implementação mais complexa que hash modular; e sem **virtual nodes**, a distribuição pode ser desigual (um nó pode receber um segmento grande do anel e virar hot spot).

**Boas práticas**: use muitas vnodes por nó físico (ex.: 100–200) para suavizar a distribuição. Monitore o tamanho de cada partição; se uma partição ficar muito maior que as outras, pode ser necessário rebalanceamento manual ou algoritmo que ajusta os limites dos nós no anel.`,
  },
  {
    title: 'Exemplo: Redis Cluster e chaves',
    content: `**Redis Cluster** usa consistent hashing com **16.384 slots**. Cada chave é mapeada a um slot via \`CRC16(key) % 16384\`. Cada nó do cluster é responsável por um subconjunto de slots. Exemplo: 3 nós, cada um com ~5.461 slots. Ao adicionar um quarto nó, apenas **cerca de 1/4 dos slots** (e suas chaves) são movidos para o novo nó; o restante permanece onde está. O cliente (ou um proxy) sabe qual nó tem qual slot e envia o comando diretamente ao nó correto; para chaves que envolvem múltiplos slots (ex.: MGET em chaves de nós diferentes), o cliente pode precisar fazer várias viagens ou usar **hash tags**: \`user:{123}:profile\` e \`user:{123}:settings\` têm o mesmo slot porque \`{123}\` é o que define o slot, permitindo operações multi-key no mesmo nó.`,
  },
]

export const objectStorageSteps: Step[] = [
  {
    title: 'O que é Object Storage?',
    content: `**Object storage** (Amazon S3, Google Cloud Storage, Azure Blob Storage, MinIO) armazena dados como **objetos** em um **namespace plano**: um **bucket** (container) e uma **key** (identificador do objeto). Cada objeto tem o conteúdo (blob binário), **metadados** (content-type, custom headers) e um **identificador**. Não há hierarquia de pastas "de verdade" — apenas prefixos na key (ex.: \`photos/2024/01/image.jpg\`) que simulam diretórios.

O modelo é otimizado para **grandes volumes**, **durabilidade** (replicação, erasure coding) e acesso via **HTTP** (REST API). Não substitui sistema de arquivos com locking nem banco de dados com queries; é ideal para **armazenar blobs** identificados por nome (chave).`,
  },
  {
    title: 'Características principais',
    content: `**Imutabilidade**  
Objetos não são "editados" no lugar. Para "atualizar", você faz um novo PUT (upload) na mesma key; muitas implementações suportam **versionamento** (guardar versões antigas). Delete pode ser soft (mark as deleted) ou hard.

**Econômico e escalável**  
Armazenamento por GB é barato; ideal para backups, logs, arquivos de mídia, data lakes. Escala praticamente sem limite; não há "tabela cheia".

**Consistência**  
S3 oferece **strong consistency** para PUT e GET (após um PUT bem-sucedido, um GET imediato retorna o novo objeto). Listagem (LIST) em algumas configurações antigas era eventualmente consistente; hoje o S3 também tem strong consistency para listagem. Outros provedores podem ter semânticas ligeiramente diferentes.`,
  },
  {
    title: 'Casos de uso e quando não usar',
    content: `**Casos de uso**: backups e snapshots; arquivos estáticos (imagens, vídeos, CSS, JS) servidos diretamente ou via CDN; data lakes (Parquet, CSV para analytics); logs e artefatos de build; armazenamento de documentos (PDFs, planilhas) identificados por ID.

**Quando não usar**: não use object storage como **banco de dados** para queries (não há índice, não há SQL). Não use para dados que precisam de **atualização in-place** frequente com transações. Não use para **sistema de arquivos** com locking e consistência forte de diretórios — para isso, sistemas de arquivos distribuídos (NFS, SMB, EFS) ou block storage podem ser mais adequados.`,
  },
  {
    title: 'APIs e recursos avançados',
    content: `**Operações básicas**: PUT (upload), GET (download), DELETE por key. **Multipart upload** para arquivos grandes (cada parte uploadada separadamente; depois complete). **Pre-signed URLs**: o backend gera uma URL temporária com assinatura; o cliente faz upload ou download direto para o S3, sem passar o tráfego pelo seu servidor — reduz carga e latência.

**Lifecycle policies**: mover objetos antigos para classes mais baratas (ex.: S3 Standard → S3 Glacier após 90 dias) ou **expirar** (deletar após N dias). **CDN na frente**: CloudFront, Cloudflare, etc., para entregar objetos com baixa latência. **Eventos**: notificação (SNS, Lambda) quando um objeto é criado ou removido — útil para processamento assíncrono.`,
  },
  {
    title: 'Exemplo: pre-signed URL e upload direto',
    content: `**Cenário**: o frontend precisa fazer upload de uma foto do usuário (até 5 MB) sem passar pelo seu backend — para não consumir banda e CPU do servidor.

**Fluxo**: (1) O usuário escolhe a foto. (2) O frontend chama seu backend: "quero fazer upload para \`photos/user123/avatar.jpg\`". (3) O backend gera uma **pre-signed URL** do S3 (PUT) com validade de 5 minutos e retorna ao frontend. (4) O frontend faz \`PUT\` diretamente na URL do S3 com o arquivo. (5) Opcional: o backend é notificado via S3 Event → Lambda e atualiza o perfil do usuário no banco.

\`\`\`python
# Backend (exemplo boto3)
url = s3.generate_presigned_url(
    'put_object',
    Params={'Bucket': 'my-bucket', 'Key': 'photos/user123/avatar.jpg'},
    ExpiresIn=300
)
return {"upload_url": url}
\`\`\`

O frontend usa \`upload_url\` com \`fetch(url, { method: 'PUT', body: file }\`. Segurança: a URL só vale para aquele bucket/key e por 5 minutos; não expõe credenciais. Para downloads privados (ex.: relatório PDF), o backend gera pre-signed GET com o mesmo padrão.`,
  },
]

export const searchSteps: Step[] = [
  {
    title: 'Full-text Search em profundidade',
    content: `**Full-text search** (Elasticsearch, OpenSearch, Apache Solr) permite buscar em **texto livre** por palavras, frases, sinônimos e **relevância**. Diferente de um banco relacional, onde você faz \`WHERE name LIKE '%termo%'\` (sem ranking e sem análise de linguagem), um motor de busca usa um **índice invertido**: para cada **termo** (palavra normalizada), guarda a lista de **documentos** que contêm esse termo e a posição/frequência. A busca retorna documentos **ranqueados** por relevância (ex.: BM25, TF-IDF) e suporta **filtros** (faixa de data, categoria) e **agregações** (facetas, estatísticas).

**Índice invertido (resumido)**: o documento "Tênis de corrida leve" vira termos [tênis, corrida, leve]. No índice: \`corrida\` → [doc1, doc5, ...], \`leve\` → [doc1, doc3, ...]. Uma busca por "corrida leve" intersecta as listas e ranqueia por frequência e raridade do termo (IDF). Isso permite respostas em milissegundos mesmo com milhões de documentos.`,
  },
  {
    title: 'Quando usar e arquitetura híbrida',
    content: `Use full-text search quando o usuário **digita uma query livre** (busca em produtos, documentos, logs) e você precisa de **relevância** e **performance** em grandes volumes de texto. **Não** substitui banco relacional para transações, integridade referencial e joins complexos.

**Arquitetura comum**: o **banco de dados** (PostgreSQL, MySQL) é a fonte da verdade para dados transacionais; um pipeline (batch ou CDC) **sincroniza** os dados para o **índice de busca** (Elasticsearch). As buscas são feitas no Elasticsearch; as escritas e leituras transacionais no banco. Consistência é **eventual** entre os dois.`,
  },
  {
    title: 'Conceitos: índice, mapping, analyzers',
    content: `**Índice**: conjunto de documentos (como uma "tabela"). **Mapping**: schema do índice — quais campos existem, tipo (text, keyword, date, integer), e se o campo é analisado (text) ou não (keyword para agregações exatas). **Analyzers**: o processo de **tokenização** e **normalização** do texto (minúsculas, stemmer, stop words); define como a query e o documento são transformados para comparação.

**Sharding e réplicas**: o índice pode ser particionado em **shards** (escala horizontal) e cada shard pode ter **réplicas** (alta disponibilidade e mais throughput de leitura). **Query DSL**: consultas em JSON (bool, match, term, range, etc.) para montar buscas complexas com filtros e scoring.`,
  },
  {
    title: 'Exemplo de fluxo e sincronização',
    content: `Fluxo típico: (1) Usuário digita "tênis corrida" na busca. (2) A aplicação envia a query para o Elasticsearch (ex.: \`match\` no campo \`description\`). (3) O Elasticsearch retorna documentos rankeados por relevância (BM25). (4) A aplicação exibe os resultados (e pode enriquecer com dados do banco se necessário).

**Sincronização banco → índice**: job batch noturno que reindexa; ou **Change Data Capture** (CDC) com Debezium, Kafka Connect, etc., que envia inserts/updates/deletes para um consumer que atualiza o índice. Assim o search reflete os dados do banco com atraso aceitável (minutos ou segundos, dependendo do pipeline).`,
  },
  {
    title: 'Exemplo: query Elasticsearch e relevância',
    content: `Consulta típica em **Elasticsearch** para busca de produtos com filtro de faixa de preço e ordenação por relevância:

\`\`\`json
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "tênis corrida" } }
      ],
      "filter": [
        { "range": { "price": { "gte": 100, "lte": 500 } } },
        { "term": { "status": "active" } }
      ]
    }
  },
  "sort": [{ "_score": "desc" }, { "created_at": "desc" }],
  "from": 0,
  "size": 20
}
\`\`\`

\`match\` no título usa o analyzer (tokenização, stemmer) e calcula **score** (BM25). \`filter\` não afeta o score, apenas restringe (preço, status). Resultados são ordenados por relevância e depois por data. **Paginação**: \`from\` + \`size\`; para offsets grandes (ex.: página 100), prefira **search_after** com cursor para evitar custo alto. Em produção, use **alias** para zero-downtime reindex (criar novo índice, sincronizar, trocar alias).`,
  },
]

export const websocketsSteps: Step[] = [
  {
    title: 'WebSocket: protocolo e handshake',
    content: `**WebSocket** é um protocolo de **comunicação bidirecional** sobre uma única conexão **TCP**. O cliente inicia com uma requisição HTTP especial (\`Upgrade: websocket\`); o servidor responde com \`101 Switching Protocols\` e a conexão "sobe" para WebSocket. A partir daí, **cliente e servidor** podem enviar **frames** (texto ou binário) a qualquer momento, sem o overhead de abrir uma nova requisição HTTP a cada mensagem. Ideal para **tempo real**: chat, notificações ao vivo, dashboards, colaboração, jogos simples.

A conexão permanece **aberta** até que um dos lados a feche ou ocorra erro. Latência típica de ida e volta é baixa (uma única conexão, sem handshake HTTP repetido).`,
  },
  {
    title: 'Arquitetura e escalabilidade',
    content: `Cada conexão WebSocket consome **uma** conexão TCP e recursos no servidor (memória, file descriptor). Com **milhares** de conexões simultâneas, um único servidor pode não dar conta; é necessário **escalar horizontalmente** (várias instâncias).

Problema: se o **cliente A** está conectado na **instância 1** e você quer enviar uma mensagem para A a partir de um evento processado na **instância 2**, a instância 2 não tem a conexão de A. Solução: **backplane** — um barramento de mensagens (Redis Pub/Sub, RabbitMQ, Kafka) onde cada instância assina canais; quando uma instância precisa enviar uma mensagem para um usuário, publica no canal; a instância que tem a conexão daquele usuário recebe e envia o frame. Além disso, o **load balancer** deve suportar WebSocket (sticky session ou proxy que mantém a conexão no mesmo backend).`,
  },
  {
    title: 'Alternativas: SSE, long polling, gRPC streaming',
    content: `**Server-Sent Events (SSE)**  
O servidor envia dados ao cliente por um fluxo HTTP unidirecional (servidor → cliente). Mais simples que WebSocket; não exige que o cliente envie dados pelo mesmo canal. Ideal para notificações, feeds ao vivo.

**Long polling**  
O cliente faz uma requisição e o servidor segura a resposta até ter dados ou timeout; o cliente repete. Mais latência e overhead que WebSocket/SSE.

**gRPC streaming**  
Bidirecional ou unidirecional; mais eficiente em termos de serialização (Protocol Buffers) e multiplexação. Requer suporte no cliente (não é nativo no browser como WebSocket); comum em backend-to-backend e apps mobile.`,
  },
  {
    title: 'Quando usar WebSocket',
    content: `Use **WebSocket** quando precisar de **push** do servidor e **baixa latência** em ambas as direções: chat, jogos em tempo real, colaboração (cursor, edição), dashboards que atualizam ao vivo. Use **SSE** quando só o servidor envia dados (notificações, logs em tempo real no admin). **Evite** WebSocket para request-response simples (um clique → uma resposta); REST ou GraphQL são mais simples e cacheáveis.`,
  },
  {
    title: 'Exemplo: backplane com Redis Pub/Sub',
    content: `Cenário: **3 instâncias** do seu app; o usuário **Alice** está conectada na **instância 2**. Uma mensagem de chat para Alice é criada por um worker na **instância 1** (que processou a fila). A instância 1 não tem a conexão WebSocket da Alice.

**Solução**: quando uma instância precisa enviar um frame para o usuário \`user_123\`, ela **publica** no Redis: \`PUBLISH ws:user_123 '{"type":"message","body":"..."}'\`. **Todas** as instâncias assinam \`SUBSCRIBE ws:user_123\` (ou um padrão por usuário). A **instância 2** recebe a mensagem do Redis, vê que tem a conexão da Alice, e envia o frame WebSocket para o browser dela. As outras instâncias ignoram (não têm essa conexão).

**Escala**: cada instância subscreve apenas os canais dos usuários que estão **conectados nela** (subscribe on connect, unsubscribe on disconnect). Assim o Redis não fica com milhões de canais ativos; cada nó só recebe mensagens dos seus usuários. Alternativa: **Redis Streams** ou **Kafka** por user_id para garantir ordenação e retenção.`,
  },
]

export const pubsubSteps: Step[] = [
  {
    title: 'Pub/Sub: modelo e desacoplamento',
    content: `No modelo **Pub/Sub** (publicar/assinar), **publicadores** enviam mensagens para um **tópico** (ou canal); **assinantes** recebem apenas as mensagens dos tópicos em que se **inscreveram**. O publicador **não sabe** quem são os assinantes; pode haver zero, um ou N assinantes. Desacoplamento total: novos assinantes podem ser adicionados sem alterar o produtor; produtores e consumidores evoluem independentemente.

Exemplos de sistemas: **Google Cloud Pub/Sub**, **AWS SNS** (tópicos) + SQS (filas para cada assinante), **Redis Pub/Sub**, **Kafka** (tópicos com partições; consumer groups se comportam como assinantes por partição). **Azure Service Bus** também oferece tópicos e assinaturas.`,
  },
  {
    title: 'Arquitetura orientada a eventos',
    content: `Em uma arquitetura **event-driven**, os serviços publicam **eventos de domínio** (ex.: "Pedido criado", "Usuário registrado") em tópicos. Outros serviços **assinam** e reagem: o serviço de notificações envia e-mail; o serviço de analytics persiste o evento; o serviço de estoque reserva itens. O serviço que criou o pedido **não chama** diretamente os outros; apenas publica o evento. Isso permite **escalabilidade** (cada consumidor processa no seu ritmo), **resiliência** (se um consumidor cair, os outros continuam; as mensagens podem ser retidas) e **flexibilidade** (novos consumidores sem mudar produtores).`,
  },
  {
    title: 'Garantias: at-least-once, ordering, retention',
    content: `**At-least-once**  
A mensagem pode ser entregue **mais de uma vez** (retry em falha). Consumidores devem ser **idempotentes** ou tolerar duplicatas.

**Exactly-once**  
Mais complexo: requer transações (Kafka), deduplicação por chave, e cuidado com commits. Nem todo sistema oferece exactly-once de ponta a ponta.

**Ordering**  
Em Kafka: ordenação garantida **dentro de uma partição**. Se precisar de ordem global, use uma única partição (gargalo) ou particione por chave (ordem por chave). SNS/SQS não garantem ordem entre mensagens.

**Retention**  
Kafka mantém mensagens por **tempo** (ex.: 7 dias); consumidores podem reprocessar. SNS entrega e descarta; se ninguém consumir, a mensagem se perde (SQS na frente do SNS retém até alguém consumir).`,
  },
  {
    title: 'Quando usar e combinação com filas',
    content: `Use **Pub/Sub** para: notificações para **vários** sistemas (um evento, N consumidores), integração assíncrona entre domínios, eventos de domínio em microserviços. **Combine** com **filas**: por exemplo, SNS publica para várias SQS (cada assinante tem sua fila); assim cada consumidor processa em seu ritmo e tem retry/DLQ. Use **Kafka** quando precisar de alto throughput, retention e consumer groups (cada mensagem processada por um consumidor do group, com múltiplos groups recebendo todas).`,
  },
  {
    title: 'Exemplo: SNS + SQS fan-out',
    content: `No **AWS**, um evento "Pedido criado" precisa acionar: (1) envio de e-mail, (2) atualização de analytics, (3) reserva de estoque. Em vez de o serviço de pedidos chamar os três (acoplamento e falha de um derruba os outros), ele publica **uma vez** no **SNS** (tópico \`order-created\`).

O SNS tem **3 assinaturas** do tipo SQS: cada uma é uma fila (mail-queue, analytics-queue, inventory-queue). O SNS entrega a mensagem nas 3 filas em paralelo. Cada **consumidor** (worker de e-mail, worker de analytics, worker de estoque) processa **sua** fila de forma independente: retry, DLQ e throughput próprios. Se o worker de e-mail cair, as outras duas filas continuam sendo consumidas. **Custo**: você paga por mensagem no SNS e por request no SQS; uma mensagem = 1 SNS publish + 3 SQS deliveries. Para milhões de eventos, esse padrão é comum e escalável.`,
  },
]

// --- System Design: fundamentos e consistência ---
export const capTheoremSteps: Step[] = [
  {
    title: 'O que é o teorema CAP?',
    content: `O **teorema CAP** (Eric Brewer) afirma que em um sistema distribuído que sofre uma **partição de rede** (nós deixam de se comunicar), é impossível garantir **simultaneamente** as três propriedades: **C**onsistency (consistência), **A**vailability (disponibilidade) e **P**artition tolerance (tolerância a partição).

Na prática, **P** é inevitável: redes falham, datacenters se isolam. Então a escolha real é entre **CP** (em caso de partição, priorizo consistência e abro mão de disponibilidade) e **AP** (priorizo disponibilidade e aceito inconsistência temporária). Não existe sistema distribuído "CA" que tolere partição; bancos em um único datacenter podem ser CA apenas enquanto não houver partição.`,
  },
  {
    title: 'Consistência (C) vs Disponibilidade (A)',
    content: `**Consistência**: toda leitura vê a escrita mais recente (ou um erro). Em partição, para manter isso você **rejeita** escritas ou leituras em nós que não conseguem se sincronizar — o sistema fica **indisponível** para esses nós.

**Disponibilidade**: toda requisição recebe uma resposta (não garantindo que seja o dado mais recente). Em partição, cada lado continua respondendo com o que tem — você aceita **consistência eventual** e possíveis conflitos.

**Exemplo CP**: um banco com replicação síncrona. Em partição, o primário não consegue confirmar escrita na réplica; então rejeita a escrita (ou deixa de aceitar leituras na réplica desconectada). **Exemplo AP**: Dynamo, Cassandra, CRDTs — em partição cada réplica aceita leituras e escritas; depois reconcilia (last-write-wins, merge).`,
  },
  {
    title: 'PACELC e nuances',
    content: `**PACELC** estende o CAP: **P**artition → **A** ou **C**; **E**lse (quando não há partição) → **L**atency ou **C**onsistency. Ou seja, mesmo sem partição você faz trade-off: priorizar **latência** (responder rápido, talvez com réplica próxima e lag) ou **consistência** (esperar sincronização).

**Sistemas reais** não são "puramente" CP ou AP: têm graus. PostgreSQL com réplica síncrona é mais CP; com assíncrona tende a AP em partição. MongoDB permite configurar write concern e read concern (local vs majority). **Entrevistas**: explique que em partição você escolhe entre falhar (CP) ou servir dados possivelmente antigos (AP); e que a decisão pode ser por operação ou por componente (ex.: estoque CP, recomendações AP).`,
  },
  {
    title: 'Quando escolher CP vs AP',
    content: `**Prefira CP** quando: débito em conta, estoque crítico (evitar oversell), eleições distribuídas, locks. O domínio exige que "o que eu leio é a verdade"; aceitar indisponibilidade em partição é preferível a mostrar saldo errado.

**Prefira AP** quando: likes, contadores de visualização, cache de perfil, feed de notícias, recomendações. O domínio tolera "eventualmente correto"; melhor servir algo um pouco atrasado do que erro 503.

**Híbrido**: sistema de pagamento pode ser CP no núcleo (ledger) e AP na camada de exibição (histórico para o usuário). Use **boundaries** claros e compensações documentadas.`,
  },
]

export const idempotencySteps: Step[] = [
  {
    title: 'Por que idempotência em sistemas distribuídos?',
    content: `Em sistemas distribuídos, **requisições falham e são retentadas**: timeout no cliente, rede instável, load balancer reenvia. Se o servidor processou a primeira vez mas o cliente não recebeu a resposta, a **retentativa** pode executar a operação de novo — e gerar efeito colateral duplicado: cobrança duas vezes, dois pedidos, dois e-mails.

**Idempotência** significa: executar a mesma operação **várias vezes** produz o **mesmo resultado** que executar uma vez. Assim, retentativas são seguras. Não é "não fazer nada na segunda vez" (isso seria apenas deduplicação); é "o efeito observável é como se tivesse sido executado uma vez". Ex.: \`SET x = 5\` é idempotente; \`INCREMENT x\` não é.`,
  },
  {
    title: 'Chave de idempotência (Idempotency Key)',
    content: `O **cliente** gera um identificador único por "intenção" (ex.: UUID) e envia em header ou corpo: \`Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000\`. O servidor:

1. **Primeira vez** com essa chave: processa, persiste o resultado associado à chave, retorna resposta.
2. **Segunda vez** com a mesma chave: não reprocessa; retorna a **mesma resposta** guardada (status 200 e corpo idêntico).

A chave deve ser **gerada pelo cliente** e cobrir a janela em que retentativas são possíveis (minutos a horas). Guardar no servidor por TTL (ex.: 24 h). **Stripe**, **PayPal** e muitas APIs de pagamento usam esse padrão.`,
  },
  {
    title: 'Implementação no servidor',
    content: `**Armazenamento**: Redis ou banco com chave única em \`(idempotency_key, user_id)\`. Ao receber request: \`GET\` pela chave; se existir, retorne a resposta armazenada. Se não existir, processe a operação, salve (chave → resposta + status) com TTL, retorne.

**Cuidados**: (1) **Lock** durante o processamento da primeira vez para que duas requisições simultâneas com a mesma chave não processem ambas. (2) **Status da operação**: guarde "in progress" para não retornar 200 antes de terminar. (3) **Conteúdo do request**: se o cliente reenviar com corpo diferente na mesma chave, rejeite (409 Conflict) — a chave identifica a intenção, o corpo deve ser o mesmo.`,
  },
  {
    title: 'Idempotência em consumidores de fila',
    content: `Em **at-least-once** delivery, a mesma mensagem pode ser entregue mais de uma vez. O **consumidor** deve ser idempotente: processar a mensagem duas vezes não deve duplicar efeito (ex.: não debitar duas vezes, não criar dois pedidos).

**Estratégias**: (1) **Chave de negócio**: antes de processar, verifique se já processou (ex.: \`order_id\` já existe no banco). (2) **Tabela de processados**: guarde \`message_id\` dos processados; ignore se já viu. (3) **Operações idempotentes por design**: "set status = PAID where order_id = X" em vez de "increment balance". Em **sagas**, compensações também devem ser idempotentes (cancelar pagamento duas vezes = uma vez).`,
  },
]

export const observabilitySteps: Step[] = [
  {
    title: 'Observabilidade: o que é e por que importa',
    content: `**Observabilidade** é a capacidade de entender o **estado interno** do sistema a partir de **sinais externos** (logs, métricas, traces). Em sistemas distribuídos, um request atravessa vários serviços; quando algo falha ou fica lento, você precisa **diagnosticar** rapidamente onde está o problema e por quê.

Os três pilares clássicos: **Métricas** (números agregados ao longo do tempo: RPS, latência p99, taxa de erro), **Logs** (eventos discretos com contexto: request_id, user_id, nível), **Traces** (propagação de uma requisição entre serviços, com tempo em cada hop). Complementar: **profiling**, **health checks** e **alertas**.`,
  },
  {
    title: 'Métricas: o que medir e onde',
    content: `**RED** para serviços: **R**equests (total por segundo), **E**rrors (taxa de 4xx/5xx), **D**uration (latência — média, p50, p95, p99). **USE** para recursos: **U**tilization, **S**aturation, **E**rrors.

**Exemplo**: serviço de pedidos expõe \`http_requests_total{path="/orders", method="POST"}\`, \`http_request_duration_seconds_bucket\`, \`http_requests_errors_total\`. Prometheus coleta; Grafana visualiza. **Slos/SLIs**: "99% das requisições < 200 ms", "erro < 0,1%". Alertas quando SLO é violado (burn rate). **Cardinalidade**: evite labels com valores ilimitados (user_id em toda métrica) para não explodir armazenamento.`,
  },
  {
    title: 'Logs estruturados e correlação',
    content: `**Logs estruturados** (JSON) em vez de texto livre: \`{"level":"info","msg":"order_created","order_id":"ord_123","user_id":"u1","trace_id":"abc"}\`. Facilita busca e agregação (Elasticsearch, Loki, CloudWatch Logs Insights).

**Correlação**: inclua \`trace_id\` (ou \`request_id\`) em **todos** os logs de uma mesma requisição, em todos os serviços. Assim você filtra por um request e vê o caminho completo. **Contexto**: user_id, tenant_id, feature flags. Não logue dados sensíveis (senhas, tokens); use máscara ou hash. **Níveis**: DEBUG em dev; INFO em prod para eventos importantes; WARN/ERROR para falhas.`,
  },
  {
    title: 'Distributed tracing em profundidade',
    content: `**Trace** = uma requisição end-to-end. **Span** = uma unidade de trabalho (uma chamada HTTP, uma query). Cada span tem: trace_id, span_id, parent_span_id, nome, início/fim, atributos. A **propagação** é feita via headers (ex.: \`traceparent\` W3C, ou \`X-B3-TraceId\`): o serviço A cria o trace e o span raiz; ao chamar B, envia trace_id e span_id; B cria um span filho com parent_span_id = span de A.

**OpenTelemetry** é o padrão: SDK em cada serviço, exportador para Jaeger, Zipkin, Tempo, etc. Você vê um **flame graph** ou timeline: onde a latência foi gasta (ex.: 80% no banco, 15% no serviço de pagamento). **Amostragem**: em alto volume, não trace 100% (custo); use amostragem por taxa ou por probabilidade.`,
  },
  {
    title: 'Alertas e runbooks',
    content: `**Alertas** devem ser **acionáveis**: "p99 latência do serviço X > 500 ms" com runbook que diz o que fazer (verificar dependências, escalar, rollback). Evite alertas que disparam demais (fadiga) ou que ninguém sabe como resolver.

**Runbook**: documento com passos para investigar e mitigar. Ex.: "Alerta: taxa de erro 5xx no API Gateway. 1) Ver dashboard de erros por backend. 2) Se backend Users em falha, verificar Circuit Breaker e dependências. 3) Rollback do último deploy se necessário." **On-call** e **post-mortems** fecham o ciclo: após incidente, documente causa raiz e ações para não repetir.`,
  },
]

// --- Patterns de microsserviços ---
export const bffSteps: Step[] = [
  {
    title: 'O que é BFF (Backend for Frontend)?',
    content: `**BFF** é um serviço (ou camada) que fica entre o **cliente** (frontend) e os **microsserviços**, desenhado para atender as necessidades de **um tipo de cliente** específico. Em vez de o app mobile ou o SPA fazer dezenas de chamadas a serviços diferentes (users, orders, recommendations, notifications), o **BFF** agrega essas chamadas em uma ou poucas requisições e devolve um payload otimizado para aquele cliente.

Cada **frontend** pode ter seu BFF: BFF para **Web**, outro para **Mobile** (que pode precisar de menos dados ou formato diferente), outro para **parceiros** (API pública). O BFF reduz round-trips, simplifica o cliente e permite evoluir a API do cliente sem mudar todos os backends.`,
  },
  {
    title: 'BFF vs API Gateway',
    content: `**API Gateway** é genérico: roteamento, auth, rate limit, SSL. Pode fazer algum aggregation, mas não é focado em "uma tela do app".

**BFF** é específico por cliente e por **caso de uso** (ex.: tela de perfil, tela de checkout). O BFF conhece a semântica: "para a tela de perfil preciso de user + últimos pedidos + preferências". Ele chama os microsserviços (em paralelo quando possível), monta o JSON e retorna. Pode fazer **transformação** (campos com nomes diferentes, dados aninhados) e **cache** específico para aquele fluxo.

Em muitas arquiteturas o **API Gateway** roteia para o **BFF** (por path ou host); o BFF então fala com os serviços. Gateway = borda; BFF = lógica de agregação por cliente.`,
  },
  {
    title: 'Implementação e trade-offs',
    content: `**Implementação**: o BFF pode ser um serviço em Node, Go ou qualquer stack. Recebe \`GET /me/profile\`, em paralelo chama Users (\`/users/me\`), Orders (\`/orders?user=me&limit=5\`), Preferences (\`/preferences/me\`), monta \`{ user, recentOrders, preferences }\` e retorna. Use **DataLoader** ou equivalente para batch e cache por request.

**Vantagens**: menos requisições do cliente, payloads enxutos, evolução independente do cliente. **Desvantagens**: o BFF vira ponto de acoplamento (mudança em uma tela pode exigir mudança no BFF); pode virar "monolito por frontend" se crescer demais. Mantenha o BFF por **bounded context** ou por plataforma (web vs mobile), não um BFF gigante para tudo.`,
  },
  {
    title: 'Exemplo: BFF para tela de checkout',
    content: `A tela de checkout precisa: carrinho, endereços do usuário, métodos de pagamento, frete disponível. Sem BFF: o frontend faz 4+ chamadas. Com BFF:

\`\`\`
GET /bff/checkout → BFF chama em paralelo:
  - Cart service: GET /carts/me
  - Users: GET /users/me/addresses
  - Payments: GET /users/me/payment-methods
  - Shipping: GET /shipping/quote (cart items, address)
  → BFF monta { cart, addresses, paymentMethods, shippingOptions }
  → Resposta única para o cliente
\`\`\`

O cliente faz **uma** requisição e recebe tudo. O BFF pode cachear por user (TTL curto) para o mesmo usuário abrindo checkout de novo. **GraphQL** é uma alternativa: o cliente declara o que quer e o resolver (que pode ser um BFF) agrega; mas BFF REST é mais simples de operar em muitos casos.`,
  },
]

export const sagaPatternSteps: Step[] = [
  {
    title: 'Saga: transações distribuídas sem 2PC',
    content: `Uma **saga** é uma sequência de **transações locais** (cada uma em um serviço/banco diferente), em que cada transação **publica um evento** ou chama o próximo passo. Se um passo **falha**, uma sequência de **compensações** (transações que desfazem efeitos anteriores) é executada para deixar o sistema em um estado consistente (ou documentadamente inconsistente para correção manual).

Diferente de **2PC** (two-phase commit), não há coordenador bloqueando recursos; cada serviço comita sua parte e o próximo passo depende de evento ou chamada. O preço é **consistência eventual** e a necessidade de desenhar compensações explícitas.`,
  },
  {
    title: 'Saga orquestrada vs coreografada',
    content: `**Orquestrada**: um **orquestrador** (serviço central ou workflow engine) chama cada participante em ordem e, em falha, chama as compensações na ordem inversa. Fluxo explícito em um lugar; fácil de entender; orquestrador pode ser single point of failure e gargalo.

**Coreografada**: cada participante faz sua parte e **publica evento**; o próximo participante reage ao evento. Não há orquestrador; desacoplamento maior. Compensações são disparadas por eventos de "falha" ou timeout. Mais difícil de debugar (fluxo distribuído) e risco de acoplamento implícito via esquema de eventos. **Temporal**, **Camunda**, **AWS Step Functions** são usados para sagas orquestradas.`,
  },
  {
    title: 'Desenho de compensações',
    content: `Cada passo da saga tem uma **compensação** que desfaz seu efeito de forma **idempotente**. Exemplo: Passo 1 "Reservar estoque" → Compensação "Liberar reserva". Passo 2 "Cobrar pagamento" → Compensação "Estornar". Passo 3 "Criar pedido" → Compensação "Cancelar pedido (status)".

**Ordem**: compensações na **ordem inversa** da execução. Se "Cobrar pagamento" falhar, compensar "Reservar estoque". Não compensar "Criar pedido" porque não foi executado. **Falha na compensação**: precisa de retry, dead-letter e possível intervenção manual (runbook). **Conflitos**: dois sagas tocando o mesmo recurso (ex.: último item em estoque) exigem locks ou versionamento otimista e nova tentativa.`,
  },
  {
    title: 'Exemplo completo: criar pedido (orquestrada)',
    content: `**Fluxo**: 1) Reservar estoque (Inventory). 2) Cobrar cartão (Payment). 3) Criar pedido (Orders). 4) Enviar confirmação (Notifications).

**Falha no passo 2** (pagamento recusado): orquestrador chama compensação do passo 1 (Liberar reserva). Não executa 3 e 4. **Falha no passo 4** (e-mail falhou): compensações na ordem inversa: cancelar pedido? Não — o pedido já é considerado criado; a compensação de "Enviar confirmação" pode ser "reenviar depois" (retry assíncrono) em vez de desfazer pedido. Defina **boundaries**: até onde compensar e onde aceitar consistência eventual com jobs de reconciliação.`,
  },
]

export const cqrsEventSourcingSteps: Step[] = [
  {
    title: 'CQRS: separação entre leitura e escrita',
    content: `**CQRS** (Command Query Responsibility Segregation) separa o **modelo de escrita** do **modelo de leitura**. Em vez de um único modelo de domínio que serve tanto para comandos (mudar estado) quanto para queries (ler), você tem **write model** (otimizado para consistência e regras de negócio) e **read model** (otimizado para consultas e exibição).

**Comandos** (ex.: "Criar pedido", "Atualizar endereço") alteram o estado; **queries** (ex.: "Listar meus pedidos", "Dashboard de vendas") apenas leem. Os read models podem ser **projeções** atualizadas por eventos: toda vez que um comando gera um evento, um consumer atualiza as views (tabelas, documentos, índices de busca). Assim você pode ter: banco relacional para escrita, Elasticsearch para busca, tabela denormalizada para listagens — cada um otimizado para seu uso.`,
  },
  {
    title: 'Event Sourcing: estado como sequência de eventos',
    content: `**Event Sourcing** persiste o **histórico de eventos** que ocorreram (ex.: "PedidoCriado", "ItemAdicionado", "PagamentoConfirmado") em vez de persistir apenas o **estado atual**. O estado atual é **derivado** ao reaplicar os eventos em ordem. O "banco" é um **log de eventos** (append-only); as projeções (read models) são construídas consumindo esse log.

**Vantagens**: auditoria completa, replay para novos read models, time-travel (estado em qualquer momento). **Desvantagens**: complexidade operacional, crescimento do log (snapshots para não reprocessar tudo), eventual consistency nas leituras. Usado em domínios com forte requisito de rastreabilidade (finanças, compliance) ou quando múltiplas leituras diferentes precisam ser alimentadas pelo mesmo fluxo de eventos.`,
  },
  {
    title: 'CQRS + Event Sourcing juntos',
    content: `Com **Event Sourcing**, o write side persiste eventos; os **read models** são atualizados por **projectors** (consumidores do stream de eventos). Cada projector mantém uma view: "tabela de pedidos por usuário", "índice de busca", "dashboard em tempo real". Isso é **CQRS**: escrita = append de eventos; leitura = consulta às views.

**Fluxo**: Comando "CriarPedido" → aggregate valida → emite evento "PedidoCriado" → evento é persistido no event store → projectors consomem e atualizam "PedidosPorUsuario", "Busca", etc. A leitura pode estar atrasada (segundos); para "read your own writes" você pode ler do write model logo após escrever ou usar evento no response. **Kafka**, **EventStore**, **Axon** são usados nesse tipo de arquitetura.`,
  },
  {
    title: 'Quando usar e quando evitar',
    content: `**Use CQRS** quando: leituras e escritas têm formas muito diferentes (muitas queries complexas, relatórios, buscas); você precisa escalar leitura e escrita de forma independente; várias equipes consomem os mesmos dados de formas diferentes.

**Use Event Sourcing** quando: auditoria e histórico são críticos; você precisa de múltiplas projeções do mesmo fluxo; o domínio é orientado a eventos por natureza. **Evite** CQRS/ES para sistemas simples com CRUD básico — a complexidade não se paga. **Evite** Event Sourcing se sua equipe não tem experiência com consistência eventual e replay. Comece com CQRS sem ES (write model tradicional, read models por eventos) e evolua se precisar.`,
  },
]

export const stranglerFigSteps: Step[] = [
  {
    title: 'Strangler Fig: migrar monolito gradualmente',
    content: `O padrão **Strangler Fig** (nome inspirado na árvore que cresce em volta de outra e acaba substituindo) permite **migrar um sistema legado** (monolito) para uma nova arquitetura (microsserviços) **gradualmente**, sem big bang. Uma camada (proxy, gateway ou BFF) fica na frente do monolito; novas funcionalidades ou rotas são implementadas nos novos serviços e o tráfego é **desviado** para eles; as partes antigas vão sendo "estranguladas" até que o monolito seja desligado ou vire um serviço menor.`,
  },
  {
    title: 'Como aplicar na prática',
    content: `**Passo 1**: coloque um **API Gateway** ou **reverse proxy** na frente do monolito. Toda requisição passa por ele. **Passo 2**: para uma **nova** feature, implemente em um microsserviço; no gateway, configure a rota para esse path/host para o novo serviço. **Passo 3**: para **funcionalidade existente**, escolha um módulo (ex.: "notificações"); reimplemente no novo serviço; no gateway, roteie \`/api/notifications\` para o novo serviço. O monolito continua servindo o resto.

**Coexistência**: durante a migração, o novo serviço pode **chamar o monolito** para dados que ainda estão lá (ex.: usuário). Ou você extrai dados via eventos/CDC. O importante é **não reescrever tudo de uma vez**: migre por domínio ou por rota, com testes e rollback possível.`,
  },
  {
    title: 'Exemplo: de monolito a serviços',
    content: `**Antes**: um único app \`monolith.com\` com \`/users\`, \`/orders\`, \`/notifications\`. **Depois do Strangler**: \`api.empresa.com\` (gateway) roteia \`/users\` e \`/orders\` ainda para o monolito; \`/notifications\` vai para o serviço \`notifications-service\`. O cliente não muda; só o roteamento no gateway.

**Próxima fase**: você extrai "orders" — novo serviço de pedidos; ele lê usuário do monolito (ou de uma réplica/cache) e grava pedidos no próprio banco. Gateway passa \`/orders\` para o novo serviço. Monolito perde a rota de pedidos; depois você migra usuários e por fim desliga o monolito. **Risco**: dependências circulares ou dados que ficam no monolito e o novo serviço precisa acessar — resolva com APIs no monolito, eventos ou duplicação temporária.`,
  },
]

export const databasePerServiceSteps: Step[] = [
  {
    title: 'Princípio: um banco por serviço',
    content: `No modelo de **microsserviços**, cada serviço é dono dos **próprios dados** e expõe apenas via **API**. Nenhum outro serviço acessa o banco do outro diretamente (sem shared database). Isso garante **desacoplamento**: o esquema do banco pode mudar sem impactar outros serviços; cada equipe escolhe a tecnologia de persistência (PostgreSQL, MongoDB, etc.) adequada ao seu domínio; falha ou deploy de um serviço não bloqueia os outros.

**Trade-off**: não há **joins** entre serviços. Para obter dados de dois serviços você faz duas chamadas (ou usa BFF/agregação) ou mantém **cópias** (read models, cache) no consumidor. Transações distribuídas não existem — use sagas ou consistência eventual.`,
  },
  {
    title: 'Comunicação entre serviços e dados',
    content: `Quando o **Serviço A** precisa de dados "do" **Serviço B**, ele **chama a API** do B (síncrona ou assíncrona). Não faz \`SELECT\` no banco do B. Ex.: serviço de Pedidos precisa do "nome do usuário" para exibir no pedido — opções: (1) chamar Users API no momento da exibição; (2) guardar uma **cópia** do nome no momento da criação do pedido (desnormalização); (3) evento "UserUpdated" para o Pedidos atualizar o nome em pedidos existentes (complexo).

**Ownership**: o "dono" do dado é o serviço que o cria e atualiza. Outros serviços podem **cachear** ou **replicar** para performance, mas a fonte da verdade é uma. **Boundary**: desenhe os limites de contexto (DDD); cada agregado vive em um serviço.`,
  },
  {
    title: 'Saga e consistência entre bancos',
    content: `Operações que envolvem **dois ou mais serviços** (e portanto dois ou mais bancos) não podem usar transação ACID distribuída (2PC é evitado em microserviços). Use **saga**: cada serviço faz sua transação local e publica evento ou responde; em falha, compensações. Os dados ficam **eventualmente consistentes**.

**Out of order**: evento "OrderCreated" pode chegar antes de "PaymentConfirmed" em um consumidor; o consumidor deve ser **idempotente** e tolerar ordem (ou usar ordenação por partição no broker). **Duplicação**: dois serviços podem ter "cópias" do mesmo conceito (ex.: \`user_id\` no Pedidos e dados do usuário no Users); a sincronização é via eventos ou chamadas. Documente onde está a **fonte da verdade** de cada dado.`,
  },
]

export const retryTimeoutSteps: Step[] = [
  {
    title: 'Retry: quando e como',
    content: `Falhas em redes e serviços são muitas vezes **transitórias** (timeout, 503, rede instável). **Retry** aumenta a chance de sucesso: tentar de novo após um breve intervalo. Mas retry **cego** pode piorar a situação: sobrecarregar um serviço já em falha (thundering herd) e aumentar latência para o usuário.

**Boas práticas**: (1) **Backoff**: esperar entre tentativas (exponencial: 1s, 2s, 4s) para dar tempo do serviço se recuperar. (2) **Jitter**: adicionar aleatoriedade ao delay para evitar que muitos clientes retentem ao mesmo tempo. (3) **Limite de tentativas**: 3–5 tentativas; depois falhar ou usar circuit breaker. (4) **Retry apenas em erros retentáveis**: 5xx, timeout, connection error; não retentar 4xx (bad request) ou 409 (conflito).`,
  },
  {
    title: 'Timeout: não esperar para sempre',
    content: `Toda chamada a outro serviço ou a rede deve ter **timeout**. Sem timeout, uma instância travada pode segurar threads/connections e derrubar o chamador (cascata). O timeout deve ser **menor** que o timeout do cliente final (ex.: usuário espera 30 s; sua chamada ao backend deve ter 10 s para que você ainda possa retornar erro ou fallback).

**Configuração**: por serviço e por operação. Operações pesadas (relatório) podem ter 60 s; operações críticas (pagamento) 5–10 s. **Propagação**: em uma cadeia A → B → C, o timeout de A deve ser maior que a soma dos timeouts de B e C (ou você usa deadline absoluto propagado via header, ex.: \`grpc-timeout\` ou \`X-Request-Deadline\`).`,
  },
  {
    title: 'Exemplo: retry com backoff exponencial',
    content: `\`\`\`python
def call_with_retry(fn, max_attempts=3):
    for attempt in range(max_attempts):
        try:
            return fn()
        except (Timeout, ConnectionError, HTTP5xx) as e:
            if attempt == max_attempts - 1:
                raise
            delay = (2 ** attempt) + random.uniform(0, 1)  # exponential + jitter
            time.sleep(delay)
    return None
\`\`\`

**Idempotência**: como retries podem reenviar a mesma requisição, o servidor deve ser **idempotente** (ou usar idempotency key). Caso contrário, "debitar conta" pode ser executado duas vezes. Combine retry com **circuit breaker**: após N falhas, pare de retentar por um tempo (circuit open).`,
  },
]

export const bulkheadSteps: Step[] = [
  {
    title: 'Bulkhead: isolar recursos por partição',
    content: `O padrão **Bulkhead** (nome da divisória em navios que limita o vazamento de água) **isola** recursos (threads, connections, CPU) por **partição** (ex.: por tipo de cliente, por operação). Se uma partição ficar sobrecarregada ou travar, as outras continuam funcionando — a falha não se espalha para todo o sistema.

**Exemplo**: um servidor tem 100 threads. Sem bulkhead: todas as 100 podem ser consumidas por chamadas lentas ao "Serviço de Relatórios"; requisições críticas (checkout) ficam sem thread e falham. Com bulkhead: 20 threads para "Relatórios", 80 para "Checkout"; mesmo que Relatórios trave, as 80 para Checkout continuam disponíveis.`,
  },
  {
    title: 'Implementação: thread pools e connection limits',
    content: `**Thread pool por destino**: em Java, um \`ExecutorService\` dedicado para chamadas ao serviço A (max 10 threads) e outro para o serviço B (max 20). Se A estiver lento, no máximo 10 threads ficam bloqueadas; B continua com 20. **Connection pool**: limite de conexões por backend (ex.: máximo 5 conexões HTTP por instância para o serviço de pagamento); excesso fica em fila ou falha rápido.

**Kubernetes**: recursos (CPU/memory) por container; namespaces e quotas. **Service mesh** (Istio): limitar conexões ou requests por segundo por destino. **Filas**: uma fila por tipo de trabalho com workers dedicados; uma fila lenta não bloqueia as outras.`,
  },
  {
    title: 'Quando usar Bulkhead',
    content: `Use quando você tem **múltiplos consumidores** ou **tipos de carga** compartilhando os mesmos recursos e quer que um não derrube os outros. Ex.: API que chama tanto "recomendações" (pode ser lento) quanto "estoque" (crítico); se recomendações travar, estoque deve continuar respondendo.

**Combinar com**: **Circuit Breaker** (evitar chamadas a serviço doente) e **Timeout** (não segurar recurso para sempre). **Custo**: mais complexidade de configuração e possível subutilização (uma partição ociosa não empresta para outra). Para muitos casos, thread pool global com timeout já ajuda; bulkhead é o próximo passo quando você precisa de isolamento forte.`,
  },
]

export const healthChecksSteps: Step[] = [
  {
    title: 'Health checks: liveness vs readiness',
    content: `**Liveness**: "o processo está vivo?". Se falhar, o orquestrador (Kubernetes, ECS) **reinicia** o container. Use para detectar deadlock ou estado irrecuperável. O check deve ser **leve** (não chamar banco ou dependências pesadas) para não reiniciar por causa de dependência temporariamente fora.

**Readiness**: "o processo está **pronto para receber tráfego**?". Se falhar, o load balancer/orquestrador **remove** a instância do pool (para de enviar requests). Use quando o app ainda está inicializando (carregando cache, conectando ao banco) ou quando uma dependência crítica está fora e você não quer receber tráfego até voltar. **Kubernetes**: \`livenessProbe\` e \`readinessProbe\` em cada Pod.`,
  },
  {
    title: 'O que expor no endpoint de health',
    content: `**\`/health\` ou \`/live\`**: retorna 200 se o processo está vivo. Pode ser vazio ou \`{"status":"ok"}\`. **\`/ready\`**: retorna 200 se está pronto (conexões com banco, filas, etc. ok); 503 se não. **\`/health/detail\`** (opcional): retorna status de cada dependência (DB, Redis, fila) para diagnóstico; use com cuidado (não exponha em público ou proteja com auth).

**Deep check**: o readiness pode fazer \`SELECT 1\` no banco; se falhar, retorna 503. Assim o load balancer para de enviar tráfego até o banco voltar. **Startup probe** (K8s): para apps que demoram a subir; evita que o liveness mate o container antes de estar pronto.`,
  },
  {
    title: 'Integração com load balancer e K8s',
    content: `**Load balancer**: configura health check (path \`/health\`, intervalo 10 s, timeout 5 s). Após N falhas consecutivas, o target é marcado unhealthy e deixa de receber tráfego. **Kubernetes**: \`readinessProbe\` com \`httpGet\` em \`/ready\`; quando falha, o Pod é removido do Service (endpoints). Novas requisições não vão para esse Pod; as que já estavam em flight podem completar ou falhar.

**Graceful shutdown**: ao receber SIGTERM, o app para de aceitar novas conexões (readiness falha) e espera as atuais terminarem dentro de um \`terminationGracePeriodSeconds\`. Assim você evita 502 durante deploy. **Order**: parar de aceitar tráfego → aguardar requests em flight → fechar conexões com DB/fila → sair.`,
  },
]

const stepsByLesson: Record<string, Step[]> = {
  'load-balancer': loadBalancerSteps,
  cache: cacheSteps,
  database: databaseSteps,
  microservices: microservicesSteps,
  cdn: cdnSteps,
  'message-queue': messageQueueSteps,
  'api-gateway': apiGatewaySteps,
  'rate-limiting': rateLimitingSteps,
  'service-discovery': serviceDiscoverySteps,
  'circuit-breaker': circuitBreakerSteps,
  'consistent-hashing': consistentHashingSteps,
  'object-storage': objectStorageSteps,
  search: searchSteps,
  websockets: websocketsSteps,
  pubsub: pubsubSteps,
  'cap-theorem': capTheoremSteps,
  idempotency: idempotencySteps,
  observability: observabilitySteps,
  bff: bffSteps,
  'saga-pattern': sagaPatternSteps,
  'cqrs-event-sourcing': cqrsEventSourcingSteps,
  'strangler-fig': stranglerFigSteps,
  'database-per-service': databasePerServiceSteps,
  'retry-timeout': retryTimeoutSteps,
  bulkhead: bulkheadSteps,
  'health-checks': healthChecksSteps,
}

export function getStepsForLesson(lessonId: string): Step[] {
  return stepsByLesson[lessonId] ?? []
}
