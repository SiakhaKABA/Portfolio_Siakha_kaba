# Rapport technique — Integration Prometheus/Grafana

**Projet** : Portfolio API (ISITech)  
**Date** : 2026-06-20  
**Stack** : Express.js / MongoDB / React / Docker Compose  

---

## 1. Contexte et objectif

Le projet Portfolio API est une application web composee de :
- **Frontend** : React/Vite (port 8080)
- **Backend** : Express.js (port 3001)
- **Base de donnees** : MongoDB 7 (port 27017)

**Objectif** : Ajouter une couche de supervision (observabilite) complete avec Prometheus (collecte de metriques) et Grafana (visualisation), le tout orchestre via Docker Compose.

---

## 2. Architecture de la supervision

```
+---------------+       scrape /metrics        +----------------+
|   Backend     |<-------- toutes les 15s -----|   Prometheus   |
|  Express.js   |                              |   (port 9090)  |
|  port 3001    |                              +-------+--------+
+---------------+                                      |
                                                       | datasource
                                                       v
                                                +----------------+
                                                |    Grafana     |
                                                |   (port 3050)  |
                                                +----------------+
```

**Flux de donnees** :
1. Le backend expose un endpoint `/metrics` au format Prometheus (texte OpenMetrics)
2. Prometheus scrape ce endpoint toutes les 15 secondes et stocke les series temporelles
3. Grafana interroge Prometheus via PromQL et affiche les dashboards

---

## 3. Fichiers crees

| Fichier | Role |
|---------|------|
| `backend/middleware/metrics.js` | Module central de metriques — declare tous les compteurs, histogrammes, gauges et exporte le middleware + helpers |
| `monitoring/prometheus/prometheus.yml` | Configuration Prometheus — definit la cible a scraper (backend:3001) |
| `monitoring/grafana/provisioning/datasources/datasource.yml` | Auto-configure Prometheus comme source de donnees Grafana au demarrage |
| `monitoring/grafana/provisioning/dashboards/dashboards.yml` | Indique a Grafana ou charger les dashboards JSON |
| `monitoring/grafana/dashboards/portfolio-api.json` | Dashboard pre-configure avec 16 panels |

---

## 4. Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `backend/package.json` | Ajout de la dependance `prom-client` (librairie officielle Prometheus pour Node.js) |
| `backend/app.js` | Import du middleware metriques, ajout du plugin Mongoose, endpoint `/metrics`, tracking des erreurs globales |
| `backend/controllers/authController.js` | Ajout du tracking des tentatives d'authentification (succes/echec) |
| `backend/controllers/projetController.js` | Ajout du tracking CRUD par action (create/read/update/delete) |
| `backend/controllers/crudController.js` | Ajout du tracking CRUD generique (formations, certifications, experiences, competences) |
| `docker-compose.yml` | Ajout des services Prometheus et Grafana + volumes persistants |

---

## 5. Metriques implementees

### 5.1 Metriques HTTP (toutes les requetes)

| Metrique | Type | Labels | Description |
|----------|------|--------|-------------|
| `http_requests_total` | Counter | method, route, status_code | Nombre total de requetes HTTP |
| `http_request_duration_seconds` | Histogram | method, route, status_code | Latence des requetes (buckets: 5ms a 5s) |
| `http_request_size_bytes` | Histogram | method, route | Taille du body des requetes entrantes |
| `http_response_size_bytes` | Histogram | method, route | Taille des reponses |
| `http_active_connections` | Gauge | — | Nombre de requetes en cours de traitement |

**Fonctionnement** : Le middleware `metricsMiddleware` s'execute sur chaque requete. Il demarre un timer au debut, incremente le gauge de connexions actives, et au `finish` de la reponse, enregistre la duree, le status code, et decremente les connexions.

### 5.2 Metriques d'authentification

| Metrique | Type | Labels | Description |
|----------|------|--------|-------------|
| `auth_attempts_total` | Counter | status (success/failure) | Compteur de tentatives de login |
| `auth_failed_consecutive` | Gauge | — | Nombre d'echecs consecutifs (reset a 0 apres un succes) |

**Utilite** : Detection de tentatives de brute-force. Si `auth_failed_consecutive` depasse un seuil (ex: 5), cela peut declencher une alerte.

### 5.3 Metriques MongoDB

| Metrique | Type | Labels | Description |
|----------|------|--------|-------------|
| `mongodb_connection_state` | Gauge | — | Etat de la connexion (0=deconnecte, 1=connecte, 2=en connexion, 3=en deconnexion) |
| `mongodb_query_duration_seconds` | Histogram | operation, collection | Latence des operations MongoDB (buckets: 1ms a 5s) |
| `mongodb_queries_total` | Counter | operation, collection, status | Nombre total d'operations par type (find, save, etc.) |
| `mongodb_connection_pool_size` | Gauge | — | Taille du pool de connexions |

**Fonctionnement** : Un plugin Mongoose (`mongooseMetricsPlugin`) est enregistre globalement. Il ajoute des hooks `pre`/`post` sur chaque operation (find, findOne, save, update, delete...) pour mesurer leur duree. L'etat de connexion est collecte toutes les 5 secondes via un `setInterval`.

### 5.4 Metriques CRUD applicatives

| Metrique | Type | Labels | Description |
|----------|------|--------|-------------|
| `crud_operations_total` | Counter | resource, action, status | Operations metier par ressource (projet, formation, certification, experience, competence) et par action (create, read, list, update, delete) |

**Utilite** : Voir quelles ressources sont les plus sollicitees, quelles actions generent des erreurs, et detecter des anomalies d'usage.

### 5.5 Metriques de sante applicative

| Metrique | Type | Labels | Description |
|----------|------|--------|-------------|
| `app_uptime_seconds` | Gauge | — | Duree depuis le demarrage du processus |
| `app_start_time_seconds` | Gauge | — | Timestamp Unix du demarrage |
| `app_errors_total` | Counter | type | Erreurs non gerees interceptees par le handler global |

### 5.6 Metriques Node.js par defaut (prom-client)

Activees via `collectDefaultMetrics()`, elles incluent automatiquement :
- `process_cpu_user_seconds_total` / `process_cpu_system_seconds_total`
- `process_resident_memory_bytes`
- `nodejs_heap_size_total_bytes` / `nodejs_heap_size_used_bytes`
- `nodejs_eventloop_lag_seconds` / `nodejs_eventloop_lag_p99_seconds`
- `nodejs_active_handles_total` / `nodejs_active_requests_total`
- `nodejs_gc_duration_seconds` (duree du garbage collector)

---

## 6. Dashboard Grafana — 16 panels

| # | Panel | Type | Ce qu'il montre |
|---|-------|------|-----------------|
| 1 | Request Rate | Time series | Requetes/seconde par methode et route |
| 2 | Request Duration | Time series | Latence p50, p95, p99 |
| 3 | HTTP Status Codes | Time series | Repartition 2xx / 4xx / 5xx dans le temps |
| 4 | Active Connections | Stat | Connexions simultanees en cours |
| 5 | Error Rate % | Stat | Pourcentage de 5xx (seuils vert/jaune/rouge) |
| 6 | App Uptime | Stat | Temps depuis le dernier redemarrage |
| 7 | Request/Response Size | Time series | Taille des payloads (p95) |
| 8 | Authentication Attempts | Time series | Courbes success vs failure |
| 9 | Consecutive Auth Failures | Stat | Indicateur brute-force (seuils 3/5) |
| 10 | CRUD Operations by Resource | Time series | Taux d'operations par ressource/action |
| 11 | CRUD Errors | Time series | Erreurs CRUD par ressource |
| 12 | MongoDB Connection State | Stat | Mapping textuel (Connected/Disconnected) |
| 13 | MongoDB Query Duration | Time series | Latence p95 par type d'operation |
| 14 | MongoDB Operations Rate | Time series | Operations/s par collection |
| 15 | Memory Usage | Time series | RSS, Heap Used, Heap Total |
| 16 | Event Loop Lag | Time series | Lag et Lag p99 |
| 17 | CPU Usage | Time series | User CPU et System CPU |
| 18 | Application Errors | Time series | Erreurs par type |

---

## 7. Configuration Docker Compose

### Services ajoutes

```yaml
prometheus:
  image: prom/prometheus:latest
  port: 9090
  volume: prometheus.yml monte + donnees persistantes
  retention: 15 jours

grafana:
  image: grafana/grafana:latest
  port: 3050
  provisioning: datasource + dashboards auto-charges au boot
  login: admin / admin
```

### Volumes persistants

| Volume | Usage |
|--------|-------|
| `prometheus_data` | Stockage des series temporelles (retention 15j) |
| `grafana_data` | Configuration Grafana, alertes, preferences |

---

## 8. Donnees de test injectees

Pour rendre le dashboard operationnel immediatement, **638+ requetes** ont ete simulees :

| Type de trafic | Quantite | But |
|----------------|----------|-----|
| GET /api/projets, formations, etc. | ~300 | Alimenter Request Rate + CRUD list |
| GET par ID | 40 | CRUD read |
| PUT (updates) | 10 | CRUD update |
| POST (creations) | ~25 | CRUD create |
| DELETE | 4 | CRUD delete |
| Erreurs 404 (ID inexistant) | 35 | Status codes 4xx |
| Erreurs 400 (ID invalide) | 18 | Validation errors |
| Auth failures | 21 | Panel authentification + brute-force |
| Routes inconnues | 15 | 404 global |
| Health checks | ~80 | Baseline traffic |

Le trafic a ete envoye en **vagues espacees de 3-5 secondes** pour creer des courbes temporelles exploitables dans les graphes.

---

## 9. Acces aux services

| Service | URL | Identifiants |
|---------|-----|-------------|
| Frontend | http://localhost:8080 | — |
| Backend API | http://localhost:3001 | — |
| Metriques brutes | http://localhost:3001/metrics | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3050 | admin / admin |
| Dashboard direct | http://localhost:3050/d/portfolio-api-monitoring | admin / admin |

---

## 10. Commandes utiles

```bash
# Demarrer tous les services
docker compose up -d --build

# Voir les logs du backend
docker compose logs -f backend

# Verifier les metriques brutes
curl http://localhost:3001/metrics

# Verifier que Prometheus scrape correctement
curl http://localhost:9090/api/v1/targets

# Requete PromQL directe
curl "http://localhost:9090/api/v1/query?query=sum(http_requests_total)"

# Redemarrer un service
docker compose restart grafana

# Arreter tout
docker compose down

# Arreter et supprimer les volumes (reset complet)
docker compose down -v
```

---

## 11. Points techniques notables

- **Pas d'impact sur les performances** : le middleware ajoute ~0.1ms par requete (timer hrtime + incrementation atomique)
- **Le endpoint `/metrics` n'est pas compte** dans les metriques CRUD (il est separe des routes metier)
- **Le plugin Mongoose est global** : tout nouveau modele ajoute au projet sera automatiquement instrumente
- **Le dashboard est provisionne** (pas besoin de l'importer manuellement) — il se recharge a chaque redemarrage de Grafana
- **Port 3050** pour Grafana au lieu de 3000 : un processus Vite local occupait deja le port 3000
- **Retention Prometheus** : 15 jours par defaut, configurable via `--storage.tsdb.retention.time`

---

## 12. Surveillance CI/CD Pipeline (v11)

### 12.1 Nouveaux composants de monitoring

| Composant | Port | Role |
|-----------|------|------|
| GitHub Exporter | 9171 | Metriques repo GitHub (stars, forks, issues, PRs, rate limit) |
| Blackbox Exporter | 9115 | Health checks HTTP (Jenkins, SonarQube, GitHub) |
| Kube State Metrics | 8081 | Metriques Kubernetes (pods, deployments, nodes) |

### 12.2 Targets Prometheus ajoutees

| Job | Target | Metriques |
|-----|--------|-----------|
| `jenkins` | host.docker.internal:8080 | Builds, queue, executors, duree |
| `sonarqube` | host.docker.internal:9000 | JVM, CE queue, health |
| `github` | github-exporter:9171 | Stars, forks, issues, PRs, rate limit |
| `kube-state-metrics` | kube-state-metrics:8080 | Pods, deployments, replicas, restarts |
| `kubernetes-apiservers` | host.docker.internal:6443 | API server K8s |
| `blackbox-http` | blackbox-exporter:9115 | Probes HTTP Jenkins/SonarQube/GitHub |

### 12.3 Alertes CI/CD (alerts-cicd.yml)

| Groupe | Alertes |
|--------|---------|
| **Jenkins** | JenkinsDown, JenkinsJobFailure, JenkinsHighQueueLength, JenkinsNodeOffline, JenkinsBuildDurationHigh |
| **SonarQube** | SonarQubeDown, SonarQubeHealthCheck, SonarQubeHighMemory, SonarQubeCEQueueHigh |
| **GitHub** | GitHubExporterDown, GitHubRateLimitLow, GitHubRepoUnreachable |
| **Kubernetes** | KubeStateMetricsDown, KubePodCrashLooping, KubePodNotReady, KubeDeploymentReplicasMismatch, KubeNodeNotReady, KubeNodeHighCPU, KubeNodeHighMemory, KubePVCAlmostFull |
| **Terraform** | TerraformDeploymentFailed, KubeDeploymentUnavailable, InfraServiceDown |

### 12.4 Dashboard Grafana CI/CD

Un nouveau dashboard `cicd-dashboard.json` comprenant 27 panels organises en sections :

| Section | Panels | Metriques cles |
|---------|--------|----------------|
| **Jenkins** | Status, Queue, Executors, Builds success/failure, Duree | jenkins_runs_*, jenkins_queue_*, jenkins_executor_* |
| **SonarQube** | Status, HTTP Probe, Duration, CE Queue | probe_success, sonarqube_ce_*, sonarqube_jvm_* |
| **GitHub** | Status, Rate Limit, Stars, Forks, Issues, PRs | github_rate_*, github_repo_* |
| **Kubernetes** | Status, Pods Running/Not-Ready, Restarts, CPU/Memoire/Network par Pod, Deployments | kube_pod_*, kube_deployment_*, container_* |
| **Terraform/Infra** | Health checks services, Probe duration, Deployments disponibles, Jenkins Terraform jobs | probe_*, kube_deployment_status_* |

### 12.5 Prerequis Jenkins

Le plugin **Prometheus Metrics** doit etre installe dans Jenkins :
- Dashboard Jenkins > Manage Jenkins > Plugins > Available > "Prometheus metrics"
- Expose automatiquement `/prometheus/` avec les metriques des builds

### 12.6 Prerequis SonarQube

SonarQube Community Edition expose `/api/monitoring/metrics` (a partir de la version 9.x).

### 12.7 Variable d'environnement requise

```bash
# Token GitHub (optionnel mais recommande pour eviter le rate limiting)
export GITHUB_TOKEN=ghp_votre_token_ici
```

---

## 13. Evolutions possibles

| Evolution | Description |
|-----------|-------------|
| Loki | Centralisation des logs avec Grafana Loki |
| Tracing | Ajouter OpenTelemetry pour le tracing distribue |
| Rate limiting | Utiliser `auth_failed_consecutive` pour bloquer automatiquement les IPs |
| GitHub Actions | Monitorer les workflows GitHub Actions en plus de Jenkins |
| ArgoCD | Surveillance des deployements GitOps avec ArgoCD |

---

## 14. Structure finale du projet

```
v11-Prometheus-grafana/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── metrics.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projetController.js
│   │   └── crudController.js
│   └── ...
├── frontend/
├── monitoring/
│   ├── docker-compose.monitoring.yml
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   ├── alerts.yml
│   │   └── alerts-cicd.yml             (NEW - alertes CI/CD)
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   ├── blackbox/
│   │   └── blackbox.yml                (NEW - health checks)
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── datasource.yml
│       │   └── dashboards/
│       │       └── dashboards.yml
│       └── dashboards/
│           ├── portfolio-dashboard.json
│           └── cicd-dashboard.json      (NEW - dashboard CI/CD)
├── docker-compose.yml
├── Jenkinsfile
├── sonar-project.properties
├── RAPPORT-MONITORING.md
└── terraform/
```
