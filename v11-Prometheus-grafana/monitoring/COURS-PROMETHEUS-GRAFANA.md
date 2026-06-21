# Cours Prometheus & Grafana - Monitoring d'une Infrastructure CI/CD

## Table des matieres

1. [Introduction au Monitoring](#1-introduction-au-monitoring)
2. [Architecture du Stack de Monitoring](#2-architecture-du-stack-de-monitoring)
3. [Prometheus - Collecte de Metriques](#3-prometheus---collecte-de-metriques)
4. [Grafana - Visualisation](#4-grafana---visualisation)
5. [Exporters et Simulateur de Metriques](#5-exporters-et-simulateur-de-metriques)
6. [Docker Compose - Orchestration du Stack](#6-docker-compose---orchestration-du-stack)
7. [Dashboards CI/CD Complet](#7-dashboards-cicd-complet)
8. [Alerting avec Alertmanager](#8-alerting-avec-alertmanager)
9. [Bonnes Pratiques](#9-bonnes-pratiques)
10. [TP Pratique](#10-tp-pratique)

---

## 1. Introduction au Monitoring

### 1.1 Pourquoi monitorer ?

Le monitoring permet de :
- **Detecter** les pannes avant qu'elles n'impactent les utilisateurs
- **Diagnostiquer** rapidement la cause des incidents
- **Mesurer** la performance et la disponibilite des services
- **Planifier** la capacite (CPU, memoire, stockage)
- **Valider** les deploiements (CI/CD)

### 1.2 Les 4 signaux dores (Golden Signals)

Selon le SRE Book de Google, les 4 metriques essentielles sont :

| Signal | Description | Exemple |
|--------|-------------|---------|
| **Latence** | Temps de reponse | HTTP request duration |
| **Trafic** | Volume de requetes | Requests/seconde |
| **Erreurs** | Taux d'echec | HTTP 5xx |
| **Saturation** | Utilisation des ressources | CPU, RAM, disque |

### 1.3 Prometheus vs autres solutions

| Critere | Prometheus | Datadog | CloudWatch |
|---------|-----------|---------|------------|
| Cout | Gratuit (open-source) | Payant | Payant (AWS) |
| Modele | Pull (scraping) | Push (agent) | Push (agent) |
| Stockage | Local TSDB | Cloud | Cloud |
| Langage requete | PromQL | Proprietaire | CloudWatch Insights |
| Alerting | Alertmanager | Integre | SNS |

---

## 2. Architecture du Stack de Monitoring

### 2.1 Schema global

```
+------------------+     scrape      +------------------+
|   Application    | <-------------- |    Prometheus    |
|   (metrics:9999) |   /metrics      |    (port 9090)   |
+------------------+                 +--------+---------+
                                              |
+------------------+     scrape               | datasource
|   Node Exporter  | <-----------+            |
|   (port 9100)    |             |    +-------v---------+
+------------------+             |    |     Grafana      |
                                 |    |    (port 3006)   |
+------------------+             |    +---------+--------+
|    cAdvisor      | <-----------+              |
|   (port 8082)    |             |              | notifications
+------------------+             |              |
                                 |    +---------v--------+
+------------------+             |    |   Alertmanager   |
| MongoDB Exporter | <-----------+    |   (port 9093)    |
|   (port 9216)    |                  +------------------+
+------------------+                          |
                                              v
                                     Email / Slack / Webhook
```

### 2.2 Composants du stack

| Service | Role | Port |
|---------|------|------|
| **Prometheus** | Collecte et stockage des metriques | 9090 |
| **Grafana** | Visualisation et dashboards | 3006 |
| **Alertmanager** | Gestion et routage des alertes | 9093 |
| **Node Exporter** | Metriques systeme (CPU, RAM, disque) | 9100 |
| **cAdvisor** | Metriques des conteneurs Docker | 8082 |
| **MongoDB Exporter** | Metriques MongoDB | 9216 |
| **Blackbox Exporter** | Probes HTTP/TCP/ICMP | 9115 |
| **Metrics Simulator** | Simulation de metriques CI/CD | 9999 |

---

## 3. Prometheus - Collecte de Metriques

### 3.1 Configuration (prometheus.yml)

Le fichier `prometheus.yml` est le coeur de la configuration :

```yaml
global:
  scrape_interval: 15s        # Frequence de collecte
  evaluation_interval: 15s    # Frequence d'evaluation des regles

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - /etc/prometheus/alerts.yml
  - /etc/prometheus/alerts-cicd.yml

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

### 3.2 Scrape Configs - Concepts cles

Chaque `job` dans `scrape_configs` definit une cible a scraper :

```yaml
scrape_configs:
  # Job simple
  - job_name: 'jenkins'
    metrics_path: /metrics          # Endpoint a scraper (defaut: /metrics)
    static_configs:
      - targets: ['metrics-simulator:9999']
        labels:
          instance: 'jenkins-local' # Label personnalise

  # Job avec filtrage de metriques
  - job_name: 'portfolio-backend'
    metrics_path: /metrics
    static_configs:
      - targets: ['metrics-simulator:9999']
        labels:
          instance: 'backend-local'
    metric_relabel_configs:         # Filtrer les metriques collectees
      - source_labels: [__name__]
        regex: 'portfolio_backend_.*'
        action: keep                # Ne garder que les metriques matchant
```

### 3.3 metric_relabel_configs - Filtrage

Quand plusieurs jobs scrapent le meme endpoint, on filtre pour eviter les doublons :

```yaml
# Ne garder que les metriques Jenkins pour ce job
- job_name: 'jenkins'
  metric_relabel_configs:
    - source_labels: [__name__]
      regex: 'jenkins_.*'
      action: keep

# Ne garder que les metriques Kubernetes et Docker
- job_name: 'kube-state-metrics'
  metric_relabel_configs:
    - source_labels: [__name__]
      regex: 'kube_.*|container_.*|docker_.*'
      action: keep
```

**Actions disponibles :**
- `keep` : ne garder que les series qui matchent
- `drop` : supprimer les series qui matchent
- `replace` : modifier un label
- `labelmap` : copier des labels
- `labeldrop` : supprimer un label

### 3.4 honor_labels

Quand une metrique expose ses propres labels `job` et `instance` :

```yaml
- job_name: 'blackbox-http'
  honor_labels: true    # Preserver les labels de la metrique
  static_configs:
    - targets: ['metrics-simulator:9999']
```

Sans `honor_labels: true`, Prometheus ecrase les labels `job` et `instance` de la metrique avec ceux du scrape config. Avec cette option, les labels de la metrique sont preserves.

### 3.5 Types de metriques Prometheus

| Type | Description | Exemple |
|------|-------------|---------|
| **Counter** | Valeur croissante | `http_requests_total` |
| **Gauge** | Valeur variable | `temperature_celsius` |
| **Histogram** | Distribution (buckets) | `request_duration_seconds_bucket` |
| **Summary** | Distribution (quantiles) | `request_duration_seconds{quantile="0.95"}` |

#### Counter
```
# HELP jenkins_runs_success_total Successful builds
# TYPE jenkins_runs_success_total counter
jenkins_runs_success_total{jenkins_job="PortfolioSonar"} 118
```

#### Gauge
```
# HELP docker_containers_total Total containers by state
# TYPE docker_containers_total gauge
docker_containers_total{state="running"} 11
docker_containers_total{state="stopped"} 2
```

#### Histogram
```
# HELP http_request_duration_seconds HTTP latency
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.01"} 350
http_request_duration_seconds_bucket{le="0.05"} 700
http_request_duration_seconds_bucket{le="0.1"} 850
http_request_duration_seconds_bucket{le="+Inf"} 1000
http_request_duration_seconds_sum 45.2
http_request_duration_seconds_count 1000
```

#### Summary
```
# HELP jenkins_runs_total_duration_milliseconds_summary Build duration
# TYPE jenkins_runs_total_duration_milliseconds_summary summary
jenkins_runs_total_duration_milliseconds_summary{quantile="0.5"} 210000
jenkins_runs_total_duration_milliseconds_summary{quantile="0.95"} 320000
jenkins_runs_total_duration_milliseconds_summary{quantile="0.99"} 380000
```

### 3.6 PromQL - Langage de requete

#### Requetes de base

```promql
# Valeur instantanee
up{job="jenkins"}

# Filtrage par label (egalite)
jenkins_runs_success_total{jenkins_job="PortfolioSonar"}

# Filtrage par regex
jenkins_runs_success_total{jenkins_job=~".*[Pp]ortfolio.*"}

# Negation
http_requests_total{status_code!="200"}
```

#### Fonctions essentielles

```promql
# Rate : taux de variation par seconde (pour counters)
rate(http_requests_total[5m])

# Increase : augmentation sur une periode
increase(jenkins_runs_success_total[1h])

# Sum : aggregation
sum(container_memory_working_set_bytes{namespace="default"}) by (pod)

# Count : nombre de series
count(kube_pod_status_phase{phase="Running"} == 1)

# Histogram_quantile : calculer les percentiles
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

#### Exemples concrets du projet

```promql
# Taux de requetes HTTP par seconde
rate(portfolio_backend_http_requests_total[5m])

# Latence P95
histogram_quantile(0.95,
  rate(portfolio_backend_http_request_duration_seconds_bucket[5m]))

# Conteneurs Docker actifs
docker_containers_total{state="running"}

# CPU par pod Kubernetes
sum(rate(container_cpu_usage_seconds_total{
  namespace="default",
  pod=~"backend.*|frontend.*|mongo.*"
}[5m])) by (pod)

# Probes HTTP (SonarQube accessible ?)
probe_success{job="blackbox-http", instance=~".*9000.*"}
```

---

## 4. Grafana - Visualisation

### 4.1 Provisioning automatique

Grafana peut etre configure entierement via fichiers (Infrastructure as Code).

#### Structure des fichiers

```
grafana/
  provisioning/
    datasources/
      datasource.yml       # Sources de donnees
    dashboards/
      dashboards.yml       # Configuration du provider
  dashboards/
    cicd-dashboard.json    # Dashboard CI/CD
    portfolio-dashboard.json  # Dashboard Backend
```

#### datasource.yml

```yaml
apiVersion: 1
datasources:
  - name: prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

#### dashboards.yml (provider)

```yaml
apiVersion: 1
providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: false
```

### 4.2 Structure d'un Dashboard JSON

```json
{
  "uid": "cicd-pipeline",
  "title": "CI/CD Pipeline",
  "tags": ["cicd", "jenkins", "sonarqube"],
  "panels": [ ... ],
  "templating": {
    "list": [
      {
        "name": "DS_PROMETHEUS",
        "type": "datasource",
        "query": "prometheus"
      }
    ]
  },
  "time": { "from": "now-1h", "to": "now" },
  "refresh": "10s"
}
```

### 4.3 Types de panels

#### Stat (valeur unique)

```json
{
  "id": 1,
  "title": "Jenkins Status",
  "type": "stat",
  "gridPos": { "h": 4, "w": 4, "x": 0, "y": 0 },
  "datasource": { "type": "prometheus", "uid": "${DS_PROMETHEUS}" },
  "targets": [
    {
      "expr": "up{job=\"jenkins\"}",
      "legendFormat": "Status"
    }
  ],
  "fieldConfig": {
    "defaults": {
      "mappings": [
        {
          "type": "value",
          "options": {
            "0": { "text": "DOWN", "color": "red" },
            "1": { "text": "UP", "color": "green" }
          }
        }
      ],
      "thresholds": {
        "steps": [
          { "color": "red", "value": null },
          { "color": "green", "value": 1 }
        ]
      }
    }
  }
}
```

#### Timeseries (graphique temporel)

```json
{
  "id": 5,
  "title": "Duree des builds",
  "type": "timeseries",
  "gridPos": { "h": 6, "w": 12, "x": 0, "y": 6 },
  "datasource": { "type": "prometheus", "uid": "${DS_PROMETHEUS}" },
  "targets": [
    {
      "expr": "jenkins_runs_total_duration_milliseconds_summary{quantile=\"0.5\"}",
      "legendFormat": "Mediane (P50)"
    },
    {
      "expr": "jenkins_runs_total_duration_milliseconds_summary{quantile=\"0.95\"}",
      "legendFormat": "P95"
    }
  ],
  "fieldConfig": {
    "defaults": { "unit": "ms" }
  }
}
```

#### Table

```json
{
  "id": 30,
  "title": "Docker Containers actifs",
  "type": "table",
  "datasource": { "type": "prometheus", "uid": "${DS_PROMETHEUS}" },
  "targets": [
    {
      "expr": "docker_container_running == 1",
      "format": "table",
      "instant": true
    }
  ],
  "fieldConfig": {
    "overrides": [
      {
        "matcher": { "id": "byName", "options": "name" },
        "properties": [{ "id": "displayName", "value": "Container" }]
      },
      {
        "matcher": { "id": "byName", "options": "Value" },
        "properties": [{ "id": "custom.hidden", "value": true }]
      }
    ]
  }
}
```

#### Gauge (jauge)

```json
{
  "id": 3,
  "title": "Executors actifs",
  "type": "gauge",
  "targets": [
    { "expr": "jenkins_executor_in_use_value" }
  ],
  "fieldConfig": {
    "defaults": {
      "max": 10,
      "thresholds": {
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 7 },
          { "color": "red", "value": 9 }
        ]
      }
    }
  }
}
```

### 4.4 Variables de template

Les variables permettent de rendre les dashboards dynamiques :

```json
"templating": {
  "list": [
    {
      "name": "DS_PROMETHEUS",
      "type": "datasource",
      "query": "prometheus"
    },
    {
      "name": "namespace",
      "type": "query",
      "query": "label_values(kube_pod_status_phase, namespace)",
      "datasource": { "uid": "${DS_PROMETHEUS}" }
    }
  ]
}
```

Usage dans les requetes : `kube_pod_status_phase{namespace="$namespace"}`

### 4.5 gridPos - Positionnement des panels

```json
"gridPos": {
  "h": 6,    // Hauteur (en unites de grille)
  "w": 12,   // Largeur (max 24 = pleine largeur)
  "x": 0,    // Position horizontale (0-23)
  "y": 0     // Position verticale
}
```

La grille Grafana fait 24 colonnes de large. Les panels se placent de haut en bas (y) et de gauche a droite (x).

---

## 5. Exporters et Simulateur de Metriques

### 5.1 Qu'est-ce qu'un exporter ?

Un exporter est un service qui :
1. Collecte des metriques d'un systeme cible
2. Les expose au format Prometheus sur un endpoint `/metrics`

### 5.2 Format d'exposition Prometheus

Le format texte est simple :

```
# HELP metric_name Description de la metrique
# TYPE metric_name type
metric_name{label1="value1",label2="value2"} valeur_numerique
```

Exemple complet :

```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 4520
http_requests_total{method="GET",status="404"} 85
http_requests_total{method="POST",status="201"} 312
```

### 5.3 Creer un exporter personnalise (Node.js)

Voici le pattern utilise dans notre projet pour simuler des metriques :

```javascript
const http = require('http')
const PORT = 9999

// Etat mutable (simule l'evolution dans le temps)
let requestCount = 0
let errorCount = 0

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function generateMetrics() {
  // Simuler du trafic
  requestCount += Math.floor(rand(1, 10))
  if (Math.random() < 0.05) errorCount++

  return `
# HELP app_http_requests_total Total des requetes HTTP
# TYPE app_http_requests_total counter
app_http_requests_total{method="GET",status="200"} ${requestCount}
app_http_requests_total{method="GET",status="500"} ${errorCount}

# HELP app_memory_bytes Memoire utilisee
# TYPE app_memory_bytes gauge
app_memory_bytes ${Math.floor(rand(50, 150) * 1024 * 1024)}
`.trim()
}

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(generateMetrics())
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<h1>Exporter</h1><a href="/metrics">/metrics</a>')
  }
})

server.listen(PORT, () => {
  console.log(`Exporter on http://localhost:${PORT}/metrics`)
})
```

### 5.4 Dockerfile de l'exporter

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY server.js .
EXPOSE 9999
CMD ["node", "server.js"]
```

### 5.5 Exporters utilises dans le projet

| Exporter | Metriques | Usage |
|----------|-----------|-------|
| **Node Exporter** | CPU, RAM, disque, reseau | Sante du serveur hote |
| **cAdvisor** | CPU/RAM/reseau par conteneur | Performance Docker |
| **MongoDB Exporter** | Connexions, ops, latence | Sante de la BDD |
| **Blackbox Exporter** | Probes HTTP/TCP | Disponibilite services |
| **Metrics Simulator** | Jenkins, SonarQube, GitHub, K8s, Docker | Simulation CI/CD |

### 5.6 Metriques exposees par notre simulateur

Notre simulateur genere des metriques pour 7 domaines :

```
JENKINS:
  jenkins_runs_success_total{jenkins_job="PortfolioSonar"}
  jenkins_runs_failure_total{jenkins_job="PortfolioSonar"}
  jenkins_runs_total_duration_milliseconds_summary{quantile="0.5|0.95|0.99"}
  jenkins_queue_size_value
  jenkins_executor_in_use_value

SONARQUBE:
  sonarqube_quality_gate{project="Portfolio-Siakha-KABA"}
  sonarqube_issues_total{severity="BLOCKER|CRITICAL|MAJOR|MINOR|INFO"}
  sonarqube_coverage_percent
  sonarqube_ce_queue_pending

GITHUB:
  github_repo_stars{repo="Portfolio_Siakha_KABA"}
  github_repo_forks
  github_repo_open_issues
  github_repo_pull_requests
  github_rate_remaining

KUBERNETES:
  kube_pod_status_phase{phase="Running"}
  kube_deployment_status_ready_replicas
  kube_pod_container_status_restarts_total
  container_cpu_usage_seconds_total
  container_memory_working_set_bytes
  container_network_receive_bytes_total
  container_network_transmit_bytes_total

DOCKER:
  docker_container_running{name="...",image="...",status="running"}
  docker_containers_total{state="running|stopped|paused"}

PROBES (Blackbox):
  probe_success{instance="http://localhost:9000",job="blackbox-http"}
  probe_duration_seconds
  probe_http_status_code

PORTFOLIO BACKEND:
  portfolio_backend_http_requests_total{method,route,status_code}
  portfolio_backend_http_request_duration_seconds_bucket{le}
  portfolio_backend_mongo_operations_total{operation}
  portfolio_backend_process_resident_memory_bytes
  portfolio_backend_nodejs_heap_size_used_bytes
```

---

## 6. Docker Compose - Orchestration du Stack

### 6.1 Fichier docker-compose.monitoring.yml

```yaml
services:
  # Prometheus - Collecte des metriques
  prometheus:
    image: prom/prometheus:latest
    container_name: portfolio-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/alerts.yml:/etc/prometheus/alerts.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'  # Retention 30 jours
      - '--web.enable-lifecycle'             # Permet le reload a chaud
    networks:
      - portfolio-network
    restart: unless-stopped

  # Grafana - Dashboards
  grafana:
    image: grafana/grafana:latest
    container_name: portfolio-grafana
    ports:
      - "3006:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    depends_on:
      - prometheus
    networks:
      - portfolio-network

  # Alertmanager - Gestion des alertes
  alertmanager:
    image: prom/alertmanager:latest
    container_name: portfolio-alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    networks:
      - portfolio-network

  # Metrics Simulator - Simulation CI/CD
  metrics-simulator:
    build: ./metrics-simulator
    container_name: portfolio-metrics-simulator
    ports:
      - "9999:9999"
    networks:
      - portfolio-network
    restart: unless-stopped

  # Node Exporter - Metriques systeme
  node-exporter:
    image: prom/node-exporter:latest
    container_name: portfolio-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
    networks:
      - portfolio-network

  # cAdvisor - Metriques conteneurs
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: portfolio-cadvisor
    ports:
      - "8082:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    privileged: true
    networks:
      - portfolio-network

volumes:
  prometheus_data:
    name: portfolio-prometheus-data
  grafana_data:
    name: portfolio-grafana-data

networks:
  portfolio-network:
    external: true
```

### 6.2 Commandes essentielles

```bash
# Demarrer le stack
docker compose -f docker-compose.monitoring.yml up -d

# Reconstruire un service apres modification
docker compose -f docker-compose.monitoring.yml build metrics-simulator
docker compose -f docker-compose.monitoring.yml up -d metrics-simulator

# Voir les logs
docker compose -f docker-compose.monitoring.yml logs -f prometheus

# Arreter le stack
docker compose -f docker-compose.monitoring.yml down

# Recharger Prometheus a chaud (sans redemarrage)
curl -X POST http://localhost:9090/-/reload

# Redemarrer Grafana (pour recharger les dashboards provisionnes)
docker compose -f docker-compose.monitoring.yml restart grafana
```

---

## 7. Dashboards CI/CD Complet

### 7.1 Vue d'ensemble du dashboard

Notre dashboard CI/CD monitore l'ensemble de la pipeline :

```
+---------------------------------------------------------------+
|                    CI/CD Pipeline Dashboard                     |
+---------------------------------------------------------------+
|  JENKINS                                                       |
|  [UP] [Queue: 0] [Executors: 1/4] [Succes: 118] [Echecs: 8] |
|  [Graph: Builds reussis vs echoues]  [Graph: Duree P50/P95]  |
+---------------------------------------------------------------+
|  SONARQUBE                                                     |
|  [UP] [Quality Gate: PASS] [Issues: 153] [Coverage: 0%]      |
|  [Probe HTTP: OK]  [CE Queue: 0]                              |
+---------------------------------------------------------------+
|  GITHUB                                                        |
|  [Stars: 3] [Forks: 1] [Issues: 0] [PRs: 0] [Rate: 4850]   |
+---------------------------------------------------------------+
|  KUBERNETES                                                    |
|  [Pods: 3] [Restarts: 0] [Deployments: ready/total]          |
|  [Graph: CPU par pod] [Graph: Memoire par pod]                |
|  [Graph: Network I/O]                                          |
+---------------------------------------------------------------+
|  DOCKER CONTAINERS                                             |
|  [Running: 11] [Stopped: 2]                                   |
|  [Table: Container | Image | Status]                          |
+---------------------------------------------------------------+
|  TERRAFORM / INFRASTRUCTURE                                    |
|  [Table: Health probes] [Graph: Probe latency]                |
|  [Deployments dispo: 2] [Graph: Jenkins Terraform jobs]       |
+---------------------------------------------------------------+
```

### 7.2 Correspondance metriques <-> panels

| Panel | Requete PromQL | Type |
|-------|----------------|------|
| Jenkins Status | `up{job="jenkins"}` | stat |
| Builds reussis vs echoues | `jenkins_runs_success_total` / `failure_total` | timeseries |
| Duree des builds | `jenkins_runs_total_duration_milliseconds_summary{quantile="0.5\|0.95"}` | timeseries |
| SonarQube Probe | `probe_success{job="blackbox-http",instance=~".*9000.*"}` | stat |
| GitHub Stars | `github_repo_stars{repo="Portfolio_Siakha_KABA"}` | stat |
| Pods Running | `count(kube_pod_status_phase{phase="Running"} == 1)` | stat |
| CPU par Pod | `sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)` | timeseries |
| Docker Running | `docker_containers_total{state="running"}` | stat |
| Docker Table | `docker_container_running == 1` | table |

### 7.3 Importance du nommage des metriques

**Probleme rencontre :** Le dashboard utilisait `jenkins_runs_success_total` mais le simulateur exposait `jenkins_builds_success_total` => "No data" dans Grafana.

**Lecon :** Les noms de metriques dans le simulateur doivent correspondre EXACTEMENT a ce que le dashboard attend. Verifier avec :

```bash
# Voir ce que le dashboard attend
grep '"expr"' cicd-dashboard.json

# Voir ce que le simulateur expose
curl http://localhost:9999/metrics | grep "^[a-z]"

# Verifier dans Prometheus
curl --data-urlencode 'query=jenkins_runs_success_total' \
  http://localhost:9090/api/v1/query
```

---

## 8. Alerting avec Alertmanager

### 8.1 Regles d'alerte (alerts.yml)

```yaml
groups:
  - name: infrastructure
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.job }} is down"
          description: "{{ $labels.instance }} has been down for more than 1 minute"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
              / node_memory_MemTotal_bytes > 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Memory usage > 85%"

  - name: cicd
    rules:
      - alert: JenkinsBuildFailing
        expr: increase(jenkins_runs_failure_total[1h]) > 3
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "Jenkins: plus de 3 builds echoues en 1h"

      - alert: SonarQubeQualityGateFailed
        expr: sonarqube_quality_gate == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Quality Gate FAILED pour le projet"
```

### 8.2 Configuration Alertmanager

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'

receivers:
  - name: 'default'
    webhook_configs:
      - url: 'http://localhost:5001/webhook'

  - name: 'critical-alerts'
    webhook_configs:
      - url: 'http://localhost:5001/webhook'
    # email_configs:
    #   - to: 'admin@example.com'
```

---

## 9. Bonnes Pratiques

### 9.1 Nommage des metriques

Suivre la convention Prometheus :

```
<namespace>_<subsystem>_<name>_<unit>

Exemples :
  portfolio_backend_http_requests_total          # counter
  portfolio_backend_http_request_duration_seconds # histogram
  docker_containers_total                        # gauge
  jenkins_runs_success_total                     # counter
```

- **Suffixe `_total`** : pour les counters
- **Suffixe `_seconds`** : pour les durees
- **Suffixe `_bytes`** : pour les tailles
- **Pas de camelCase** : utiliser snake_case

### 9.2 Labels

```
# BON : labels avec cardinalite faible
http_requests_total{method="GET", status="200"}

# MAUVAIS : labels avec cardinalite infinie
http_requests_total{user_id="12345", request_id="abc-def-ghi"}
```

**Regle :** Ne jamais mettre de valeurs a cardinalite infinie (IDs, timestamps, URLs completes) dans les labels.

### 9.3 Retention et performances

```yaml
# prometheus.yml - Flags de demarrage
command:
  - '--storage.tsdb.retention.time=30d'     # Duree de retention
  - '--storage.tsdb.retention.size=10GB'    # Taille max
  - '--web.enable-lifecycle'                # Reload sans restart
```

### 9.4 Haute disponibilite

Pour la production :
- **Prometheus** : 2 instances avec les memes targets (pas de clustering natif)
- **Alertmanager** : cluster natif (gossip protocol)
- **Grafana** : scaling horizontal + base PostgreSQL partagee
- **Thanos/Cortex** : pour le stockage longue duree

### 9.5 Securite

```yaml
# Grafana - Desactiver l'inscription
environment:
  - GF_SECURITY_ADMIN_PASSWORD=motDePasse_Fort!
  - GF_USERS_ALLOW_SIGN_UP=false

# Prometheus - Pas d'authentification native
# Utiliser un reverse proxy (nginx/traefik) avec auth
```

---

## 10. TP Pratique

### TP 1 : Deployer le stack de monitoring

```bash
# 1. Creer le reseau Docker
docker network create portfolio-network

# 2. Demarrer le stack
cd v11-Prometheus-grafana/monitoring
docker compose -f docker-compose.monitoring.yml up -d

# 3. Verifier les services
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 4. Acceder aux interfaces
# Prometheus : http://localhost:9090
# Grafana    : http://localhost:3006 (admin/admin123)
# Alertmanager : http://localhost:9093
```

### TP 2 : Verifier les targets Prometheus

1. Aller sur http://localhost:9090/targets
2. Verifier que tous les targets sont `UP`
3. Si un target est `DOWN`, verifier :
   - Le service tourne-t-il ? (`docker ps`)
   - Le port est-il correct ?
   - Le service est-il sur le meme reseau Docker ?

### TP 3 : Explorer les metriques

```bash
# Lister toutes les metriques disponibles
curl http://localhost:9999/metrics | grep "^# HELP"

# Requeter Prometheus
curl --data-urlencode 'query=up' http://localhost:9090/api/v1/query

# Requete avec filtre
curl --data-urlencode \
  'query=jenkins_runs_success_total{jenkins_job="PortfolioSonar"}' \
  http://localhost:9090/api/v1/query
```

### TP 4 : Creer un panel Grafana

1. Aller sur Grafana > Dashboard CI/CD
2. Cliquer "Edit" > "Add panel"
3. Datasource : Prometheus
4. Requete : `rate(portfolio_backend_http_requests_total[5m])`
5. Visualization : Time series
6. Titre : "Requetes HTTP/s"
7. Sauvegarder

### TP 5 : Ajouter une alerte

Creer une alerte quand le taux d'erreur depasse 5% :

```yaml
# alerts.yml
- alert: HighErrorRate
  expr: |
    sum(rate(portfolio_backend_http_requests_total{status_code=~"5.."}[5m]))
    /
    sum(rate(portfolio_backend_http_requests_total[5m]))
    > 0.05
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "Taux d'erreur HTTP > 5%"
```

### TP 6 : Modifier le simulateur

Ajouter une nouvelle metrique au simulateur :

```javascript
// Dans server.js, ajouter dans generateMetrics() :
# HELP custom_metric_example Exemple de metrique custom
# TYPE custom_metric_example gauge
custom_metric_example{environment="dev"} ${rand(0, 100).toFixed(1)}
```

Puis :
```bash
# Rebuild et redeploy
docker compose -f docker-compose.monitoring.yml build metrics-simulator
docker compose -f docker-compose.monitoring.yml up -d metrics-simulator

# Verifier
curl http://localhost:9999/metrics | grep custom_metric
```

---

## Resume des commandes utiles

| Action | Commande |
|--------|----------|
| Demarrer le stack | `docker compose -f docker-compose.monitoring.yml up -d` |
| Rebuild un service | `docker compose -f ... build <service>` |
| Reload Prometheus | `curl -X POST http://localhost:9090/-/reload` |
| Restart Grafana | `docker compose -f ... restart grafana` |
| Voir les targets | http://localhost:9090/targets |
| Requete PromQL | `curl --data-urlencode 'query=...' http://localhost:9090/api/v1/query` |
| Voir les metriques brutes | `curl http://localhost:9999/metrics` |
| Logs d'un service | `docker compose -f ... logs -f <service>` |
| Status des conteneurs | `docker ps --format "table {{.Names}}\t{{.Status}}"` |

---

## Glossaire

| Terme | Definition |
|-------|-----------|
| **Scrape** | Action de Prometheus de collecter les metriques d'un endpoint |
| **Target** | Endpoint que Prometheus scrape |
| **Job** | Groupe de targets avec la meme fonction |
| **Exporter** | Service qui expose des metriques au format Prometheus |
| **PromQL** | Langage de requete de Prometheus |
| **TSDB** | Time Series Database - base de donnees temporelles |
| **Label** | Paire cle-valeur qui identifie une serie temporelle |
| **Panel** | Element visuel dans un dashboard Grafana |
| **Datasource** | Source de donnees dans Grafana (ex: Prometheus) |
| **Provisioning** | Configuration automatique via fichiers |
| **Counter** | Metrique qui ne fait qu'augmenter |
| **Gauge** | Metrique qui peut monter et descendre |
| **Histogram** | Distribution de valeurs dans des buckets |
| **Summary** | Distribution avec des quantiles pre-calcules |
| **Alertmanager** | Gestionnaire d'alertes de Prometheus |
| **Golden Signals** | 4 metriques cles : latence, trafic, erreurs, saturation |

---

*Cours redige a partir du projet Portfolio Siakha KABA - Stack monitoring Prometheus/Grafana v11*
