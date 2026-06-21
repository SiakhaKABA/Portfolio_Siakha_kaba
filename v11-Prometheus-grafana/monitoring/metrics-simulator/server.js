const http = require('http')
const PORT = 9999

let buildNumber = 126
let successBuilds = 118
let failedBuilds = 8
let totalDuration = 14580
let httpTotal = { GET200: 4520, GET404: 85, POST201: 312, POST400: 23, PUT200: 156, DELETE200: 48, GET500: 12 }
let mongoOps = { find: 3200, insertOne: 312, updateOne: 156, deleteOne: 48 }

function rand(min, max) { return Math.random() * (max - min) + min }

function generateMetrics() {
  // Simulate traffic
  httpTotal.GET200 += Math.floor(rand(1, 8))
  httpTotal.GET404 += Math.random() < 0.3 ? 1 : 0
  httpTotal.POST201 += Math.random() < 0.2 ? 1 : 0
  httpTotal.POST400 += Math.random() < 0.05 ? 1 : 0
  httpTotal.PUT200 += Math.random() < 0.15 ? 1 : 0
  httpTotal.DELETE200 += Math.random() < 0.05 ? 1 : 0
  httpTotal.GET500 += Math.random() < 0.02 ? 1 : 0
  mongoOps.find += Math.floor(rand(1, 6))
  mongoOps.insertOne += Math.random() < 0.2 ? 1 : 0
  mongoOps.updateOne += Math.random() < 0.15 ? 1 : 0
  mongoOps.deleteOne += Math.random() < 0.05 ? 1 : 0

  if (Math.random() < 0.03) {
    buildNumber++
    totalDuration += rand(180, 360)
    if (Math.random() < 0.85) successBuilds++
    else failedBuilds++
  }

  const allHTTP = Object.values(httpTotal).reduce((a, b) => a + b, 0)
  const heapUsed = Math.floor(rand(45, 75) * 1024 * 1024)
  const heapTotal = Math.floor(rand(80, 120) * 1024 * 1024)
  const rss = Math.floor(rand(100, 160) * 1024 * 1024)

  return `
# ════════════════════════════════════════════════════════
# JENKINS
# ════════════════════════════════════════════════════════
# HELP jenkins_up Jenkins status
# TYPE jenkins_up gauge
jenkins_up 1
# HELP jenkins_queue_size_value Build queue size
# TYPE jenkins_queue_size_value gauge
jenkins_queue_size_value ${Math.floor(rand(0, 2))}
# HELP jenkins_executor_in_use_value Executors in use
# TYPE jenkins_executor_in_use_value gauge
jenkins_executor_in_use_value ${Math.floor(rand(0, 3))}
# HELP jenkins_executor_count_value Total executors
# TYPE jenkins_executor_count_value gauge
jenkins_executor_count_value 4
# HELP jenkins_runs_success_total Successful builds
# TYPE jenkins_runs_success_total counter
jenkins_runs_success_total{jenkins_job="PortfolioSonar"} ${successBuilds}
# HELP jenkins_runs_failure_total Failed builds
# TYPE jenkins_runs_failure_total counter
jenkins_runs_failure_total{jenkins_job="PortfolioSonar"} ${failedBuilds}
# HELP jenkins_runs_total_duration_milliseconds_summary Build duration summary
# TYPE jenkins_runs_total_duration_milliseconds_summary summary
jenkins_runs_total_duration_milliseconds_summary{jenkins_job="PortfolioSonar",quantile="0.5"} ${Math.floor(rand(180000, 240000))}
jenkins_runs_total_duration_milliseconds_summary{jenkins_job="PortfolioSonar",quantile="0.95"} ${Math.floor(rand(280000, 350000))}
jenkins_runs_total_duration_milliseconds_summary{jenkins_job="PortfolioSonar",quantile="0.99"} ${Math.floor(rand(340000, 400000))}
jenkins_runs_total_duration_milliseconds_summary_count{jenkins_job="PortfolioSonar"} ${buildNumber}
jenkins_runs_total_duration_milliseconds_summary_sum{jenkins_job="PortfolioSonar"} ${totalDuration * 1000}
# HELP jenkins_builds_success_total Total successful builds
# TYPE jenkins_builds_success_total counter
jenkins_builds_success_total ${successBuilds}
# HELP jenkins_builds_failed_total Total failed builds
# TYPE jenkins_builds_failed_total counter
jenkins_builds_failed_total ${failedBuilds}
# HELP jenkins_node_online Node online
# TYPE jenkins_node_online gauge
jenkins_node_online{node="master"} 1
# HELP jenkins_plugins_active Active plugins
# TYPE jenkins_plugins_active gauge
jenkins_plugins_active 42

# ════════════════════════════════════════════════════════
# SONARQUBE
# ════════════════════════════════════════════════════════
# HELP sonarqube_up SonarQube status
# TYPE sonarqube_up gauge
sonarqube_up 1
# HELP sonarqube_ce_queue_pending CE tasks pending
# TYPE sonarqube_ce_queue_pending gauge
sonarqube_ce_queue_pending 0
# HELP sonarqube_quality_gate Quality gate (1=OK)
# TYPE sonarqube_quality_gate gauge
sonarqube_quality_gate{project="Portfolio-Siakha-KABA"} 1
# HELP sonarqube_issues_total Issues by severity
# TYPE sonarqube_issues_total gauge
sonarqube_issues_total{severity="BLOCKER"} 0
sonarqube_issues_total{severity="CRITICAL"} 0
sonarqube_issues_total{severity="MAJOR"} ${Math.floor(rand(8, 12))}
sonarqube_issues_total{severity="MINOR"} ${Math.floor(rand(25, 35))}
sonarqube_issues_total{severity="INFO"} ${Math.floor(rand(60, 75))}
# HELP sonarqube_coverage_percent Coverage
# TYPE sonarqube_coverage_percent gauge
sonarqube_coverage_percent{project="Portfolio-Siakha-KABA"} 0.0
# HELP sonarqube_lines_of_code Lines of code
# TYPE sonarqube_lines_of_code gauge
sonarqube_lines_of_code{project="Portfolio-Siakha-KABA"} 2100
# HELP sonarqube_vulnerabilities Vulnerabilities
# TYPE sonarqube_vulnerabilities gauge
sonarqube_vulnerabilities{project="Portfolio-Siakha-KABA"} 0
# HELP sonarqube_bugs Bugs
# TYPE sonarqube_bugs gauge
sonarqube_bugs{project="Portfolio-Siakha-KABA"} 0
# HELP sonarqube_code_smells Code smells
# TYPE sonarqube_code_smells gauge
sonarqube_code_smells{project="Portfolio-Siakha-KABA"} 153

# ════════════════════════════════════════════════════════
# GITHUB
# ════════════════════════════════════════════════════════
# HELP github_rate_remaining API rate limit remaining
# TYPE github_rate_remaining gauge
github_rate_remaining 4850
# HELP github_repo_stars Stars
# TYPE github_repo_stars gauge
github_repo_stars{repo="Portfolio_Siakha_KABA",owner="SiakhaKABA"} 3
# HELP github_repo_forks Forks
# TYPE github_repo_forks gauge
github_repo_forks{repo="Portfolio_Siakha_KABA",owner="SiakhaKABA"} 1
# HELP github_repo_open_issues Open issues
# TYPE github_repo_open_issues gauge
github_repo_open_issues{repo="Portfolio_Siakha_KABA",owner="SiakhaKABA"} ${Math.floor(rand(0, 2))}
# HELP github_repo_pull_requests Pull requests open
# TYPE github_repo_pull_requests gauge
github_repo_pull_requests{repo="Portfolio_Siakha_KABA",owner="SiakhaKABA"} ${Math.floor(rand(0, 1))}
# HELP github_repo_watchers Watchers
# TYPE github_repo_watchers gauge
github_repo_watchers{repo="Portfolio_Siakha_KABA",owner="SiakhaKABA"} 2
# HELP github_repo_size_kb Repo size
# TYPE github_repo_size_kb gauge
github_repo_size_kb{repo="Portfolio_Siakha_KABA"} 15200

# ════════════════════════════════════════════════════════
# KUBERNETES
# ════════════════════════════════════════════════════════
# HELP kube_pod_status_phase Pod phase
# TYPE kube_pod_status_phase gauge
kube_pod_status_phase{namespace="default",pod="backend-7d8f9b6c4-x2k9m",phase="Running"} 1
kube_pod_status_phase{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",phase="Running"} 1
kube_pod_status_phase{namespace="default",pod="mongodb-0",phase="Running"} 1
# HELP kube_pod_status_ready Pod ready condition
# TYPE kube_pod_status_ready gauge
kube_pod_status_ready{namespace="default",pod="backend-7d8f9b6c4-x2k9m",condition="true"} 1
kube_pod_status_ready{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",condition="true"} 1
kube_pod_status_ready{namespace="default",pod="mongodb-0",condition="true"} 1
# HELP kube_pod_container_status_restarts_total Restarts
# TYPE kube_pod_container_status_restarts_total counter
kube_pod_container_status_restarts_total{namespace="default",pod="backend-7d8f9b6c4-x2k9m",container="backend"} ${Math.floor(rand(0, 2))}
kube_pod_container_status_restarts_total{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",container="frontend"} 0
kube_pod_container_status_restarts_total{namespace="default",pod="mongodb-0",container="mongodb"} 0
# HELP kube_deployment_status_replicas_available Available replicas
# TYPE kube_deployment_status_replicas_available gauge
kube_deployment_status_replicas_available{namespace="default",deployment="backend"} 1
kube_deployment_status_replicas_available{namespace="default",deployment="frontend"} 1
# HELP kube_deployment_status_ready_replicas Ready replicas
# TYPE kube_deployment_status_ready_replicas gauge
kube_deployment_status_ready_replicas{namespace="default",deployment="backend"} 1
kube_deployment_status_ready_replicas{namespace="default",deployment="frontend"} 1
# HELP kube_deployment_status_available_replicas Available replicas
# TYPE kube_deployment_status_available_replicas gauge
kube_deployment_status_available_replicas{namespace="default",deployment="backend"} 1
kube_deployment_status_available_replicas{namespace="default",deployment="frontend"} 1
# HELP kube_deployment_spec_replicas Desired replicas
# TYPE kube_deployment_spec_replicas gauge
kube_deployment_spec_replicas{namespace="default",deployment="backend"} 1
kube_deployment_spec_replicas{namespace="default",deployment="frontend"} 1
# HELP kube_node_status_condition Node condition
# TYPE kube_node_status_condition gauge
kube_node_status_condition{node="docker-desktop",condition="Ready",status="true"} 1
# HELP container_cpu_usage_seconds_total Container CPU
# TYPE container_cpu_usage_seconds_total counter
container_cpu_usage_seconds_total{namespace="default",pod="backend-7d8f9b6c4-x2k9m",container="backend"} ${rand(50, 200).toFixed(2)}
container_cpu_usage_seconds_total{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",container="frontend"} ${rand(20, 80).toFixed(2)}
container_cpu_usage_seconds_total{namespace="default",pod="mongodb-0",container="mongodb"} ${rand(30, 100).toFixed(2)}
# HELP container_memory_working_set_bytes Container memory
# TYPE container_memory_working_set_bytes gauge
container_memory_working_set_bytes{namespace="default",pod="backend-7d8f9b6c4-x2k9m",container="backend"} ${Math.floor(rand(80, 150) * 1024 * 1024)}
container_memory_working_set_bytes{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",container="frontend"} ${Math.floor(rand(30, 60) * 1024 * 1024)}
container_memory_working_set_bytes{namespace="default",pod="mongodb-0",container="mongodb"} ${Math.floor(rand(100, 200) * 1024 * 1024)}
# HELP container_network_receive_bytes_total Network RX
# TYPE container_network_receive_bytes_total counter
container_network_receive_bytes_total{namespace="default",pod="backend-7d8f9b6c4-x2k9m"} ${Math.floor(rand(5000000, 20000000))}
container_network_receive_bytes_total{namespace="default",pod="frontend-5c4d8e7f2-p8n3q"} ${Math.floor(rand(2000000, 8000000))}
container_network_receive_bytes_total{namespace="default",pod="mongodb-0"} ${Math.floor(rand(3000000, 12000000))}
# HELP container_network_transmit_bytes_total Network TX
# TYPE container_network_transmit_bytes_total counter
container_network_transmit_bytes_total{namespace="default",pod="backend-7d8f9b6c4-x2k9m"} ${Math.floor(rand(8000000, 30000000))}
container_network_transmit_bytes_total{namespace="default",pod="frontend-5c4d8e7f2-p8n3q"} ${Math.floor(rand(10000000, 40000000))}
container_network_transmit_bytes_total{namespace="default",pod="mongodb-0"} ${Math.floor(rand(4000000, 15000000))}

# ════════════════════════════════════════════════════════
# DOCKER CONTAINERS
# ════════════════════════════════════════════════════════
# HELP docker_container_running Running Docker containers
# TYPE docker_container_running gauge
docker_container_running{name="portfolio-prometheus",image="prom/prometheus:latest",status="running"} 1
docker_container_running{name="portfolio-grafana",image="grafana/grafana:latest",status="running"} 1
docker_container_running{name="portfolio-alertmanager",image="prom/alertmanager:latest",status="running"} 1
docker_container_running{name="portfolio-metrics-simulator",image="monitoring-metrics-simulator:latest",status="running"} 1
docker_container_running{name="portfolio-node-exporter",image="prom/node-exporter:latest",status="running"} 1
docker_container_running{name="portfolio-cadvisor",image="gcr.io/cadvisor/cadvisor:latest",status="running"} 1
docker_container_running{name="portfolio-mongodb-exporter",image="percona/mongodb_exporter:0.40",status="running"} 1
docker_container_running{name="sonarqube",image="sonarqube:lts-community",status="running"} 1
docker_container_running{name="k8s_frontend",image="siakhakaba/portfolio-frontend:latest",status="running"} 1
docker_container_running{name="k8s_backend",image="siakhakaba/portfolio-backend:latest",status="running"} 1
docker_container_running{name="k8s_mongo",image="mongo:6",status="running"} 1
# HELP docker_containers_total Total containers by state
# TYPE docker_containers_total gauge
docker_containers_total{state="running"} 11
docker_containers_total{state="stopped"} 2
docker_containers_total{state="paused"} 0

# ════════════════════════════════════════════════════════
# BLACKBOX PROBES
# ════════════════════════════════════════════════════════
# HELP probe_success Probe success
# TYPE probe_success gauge
probe_success{instance="http://localhost:8080/login",job="blackbox-http"} 1
probe_success{instance="http://localhost:9000",job="blackbox-http"} 1
probe_success{instance="https://github.com/Siakha-KABA",job="blackbox-http"} 1
# HELP probe_duration_seconds Probe duration
# TYPE probe_duration_seconds gauge
probe_duration_seconds{instance="http://localhost:8080/login",job="blackbox-http"} ${rand(0.05, 0.2).toFixed(3)}
probe_duration_seconds{instance="http://localhost:9000",job="blackbox-http"} ${rand(0.1, 0.35).toFixed(3)}
probe_duration_seconds{instance="https://github.com/Siakha-KABA",job="blackbox-http"} ${rand(0.2, 0.6).toFixed(3)}
# HELP probe_http_status_code HTTP status
# TYPE probe_http_status_code gauge
probe_http_status_code{instance="http://localhost:8080/login",job="blackbox-http"} 200
probe_http_status_code{instance="http://localhost:9000",job="blackbox-http"} 200
probe_http_status_code{instance="https://github.com/Siakha-KABA",job="blackbox-http"} 200

# ════════════════════════════════════════════════════════
# TERRAFORM
# ════════════════════════════════════════════════════════
# HELP terraform_resources_total Managed resources
# TYPE terraform_resources_total gauge
terraform_resources_total{workspace="default"} 12
# HELP terraform_apply_duration_seconds Apply duration
# TYPE terraform_apply_duration_seconds gauge
terraform_apply_duration_seconds ${rand(18, 42).toFixed(1)}
# HELP terraform_state_drift Drift detected
# TYPE terraform_state_drift gauge
terraform_state_drift 0

# ════════════════════════════════════════════════════════
# PORTFOLIO BACKEND
# ════════════════════════════════════════════════════════
# HELP portfolio_backend_http_requests_total HTTP requests
# TYPE portfolio_backend_http_requests_total counter
portfolio_backend_http_requests_total{method="GET",route="/api/projets",status_code="200"} ${httpTotal.GET200}
portfolio_backend_http_requests_total{method="GET",route="/api/projets",status_code="404"} ${httpTotal.GET404}
portfolio_backend_http_requests_total{method="GET",route="/api/formations",status_code="200"} ${Math.floor(httpTotal.GET200 * 0.6)}
portfolio_backend_http_requests_total{method="GET",route="/api/competences",status_code="200"} ${Math.floor(httpTotal.GET200 * 0.5)}
portfolio_backend_http_requests_total{method="GET",route="/api/experiences",status_code="200"} ${Math.floor(httpTotal.GET200 * 0.4)}
portfolio_backend_http_requests_total{method="GET",route="/api/certifications",status_code="200"} ${Math.floor(httpTotal.GET200 * 0.35)}
portfolio_backend_http_requests_total{method="POST",route="/api/projets",status_code="201"} ${httpTotal.POST201}
portfolio_backend_http_requests_total{method="POST",route="/api/projets",status_code="400"} ${httpTotal.POST400}
portfolio_backend_http_requests_total{method="PUT",route="/api/projets/:id",status_code="200"} ${httpTotal.PUT200}
portfolio_backend_http_requests_total{method="DELETE",route="/api/projets/:id",status_code="200"} ${httpTotal.DELETE200}
portfolio_backend_http_requests_total{method="GET",route="/api/projets",status_code="500"} ${httpTotal.GET500}
portfolio_backend_http_requests_total{method="POST",route="/api/auth/login",status_code="200"} ${Math.floor(httpTotal.POST201 * 0.8)}
portfolio_backend_http_requests_total{method="POST",route="/api/auth/login",status_code="401"} ${Math.floor(rand(5, 20))}
# HELP portfolio_backend_http_request_duration_seconds HTTP latency
# TYPE portfolio_backend_http_request_duration_seconds histogram
portfolio_backend_http_request_duration_seconds_bucket{le="0.005"} ${Math.floor(allHTTP * 0.15)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.01"} ${Math.floor(allHTTP * 0.35)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.025"} ${Math.floor(allHTTP * 0.55)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.05"} ${Math.floor(allHTTP * 0.7)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.1"} ${Math.floor(allHTTP * 0.85)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.25"} ${Math.floor(allHTTP * 0.93)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.5"} ${Math.floor(allHTTP * 0.97)}
portfolio_backend_http_request_duration_seconds_bucket{le="1"} ${Math.floor(allHTTP * 0.99)}
portfolio_backend_http_request_duration_seconds_bucket{le="2.5"} ${Math.floor(allHTTP * 0.998)}
portfolio_backend_http_request_duration_seconds_bucket{le="+Inf"} ${allHTTP}
portfolio_backend_http_request_duration_seconds_sum ${(allHTTP * 0.045).toFixed(2)}
portfolio_backend_http_request_duration_seconds_count ${allHTTP}
# HELP portfolio_backend_mongo_operations_total MongoDB ops
# TYPE portfolio_backend_mongo_operations_total counter
portfolio_backend_mongo_operations_total{operation="find"} ${mongoOps.find}
portfolio_backend_mongo_operations_total{operation="insertOne"} ${mongoOps.insertOne}
portfolio_backend_mongo_operations_total{operation="updateOne"} ${mongoOps.updateOne}
portfolio_backend_mongo_operations_total{operation="deleteOne"} ${mongoOps.deleteOne}
# HELP portfolio_backend_mongo_operation_duration_seconds MongoDB latency
# TYPE portfolio_backend_mongo_operation_duration_seconds histogram
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.001"} ${Math.floor(mongoOps.find * 0.3)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.005"} ${Math.floor(mongoOps.find * 0.6)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.01"} ${Math.floor(mongoOps.find * 0.8)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.05"} ${Math.floor(mongoOps.find * 0.95)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="+Inf"} ${mongoOps.find}
portfolio_backend_mongo_operation_duration_seconds_sum{operation="find"} ${(mongoOps.find * 0.008).toFixed(2)}
portfolio_backend_mongo_operation_duration_seconds_count{operation="find"} ${mongoOps.find}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.005"} ${Math.floor(mongoOps.insertOne * 0.5)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.01"} ${Math.floor(mongoOps.insertOne * 0.75)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.05"} ${Math.floor(mongoOps.insertOne * 0.92)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="+Inf"} ${mongoOps.insertOne}
portfolio_backend_mongo_operation_duration_seconds_sum{operation="insertOne"} ${(mongoOps.insertOne * 0.012).toFixed(2)}
portfolio_backend_mongo_operation_duration_seconds_count{operation="insertOne"} ${mongoOps.insertOne}
# HELP portfolio_backend_process_resident_memory_bytes RSS memory
# TYPE portfolio_backend_process_resident_memory_bytes gauge
portfolio_backend_process_resident_memory_bytes ${rss}
# HELP portfolio_backend_nodejs_heap_size_used_bytes Heap used
# TYPE portfolio_backend_nodejs_heap_size_used_bytes gauge
portfolio_backend_nodejs_heap_size_used_bytes ${heapUsed}
# HELP portfolio_backend_nodejs_heap_size_total_bytes Heap total
# TYPE portfolio_backend_nodejs_heap_size_total_bytes gauge
portfolio_backend_nodejs_heap_size_total_bytes ${heapTotal}
# HELP portfolio_backend_process_cpu_user_seconds_total CPU time
# TYPE portfolio_backend_process_cpu_user_seconds_total counter
portfolio_backend_process_cpu_user_seconds_total ${rand(50, 120).toFixed(2)}
# HELP portfolio_backend_nodejs_eventloop_lag_seconds Event loop lag
# TYPE portfolio_backend_nodejs_eventloop_lag_seconds gauge
portfolio_backend_nodejs_eventloop_lag_seconds ${rand(0.001, 0.012).toFixed(4)}
# HELP portfolio_backend_nodejs_eventloop_lag_p99_seconds Event loop P99
# TYPE portfolio_backend_nodejs_eventloop_lag_p99_seconds gauge
portfolio_backend_nodejs_eventloop_lag_p99_seconds ${rand(0.005, 0.04).toFixed(4)}
# HELP portfolio_backend_nodejs_gc_duration_seconds_sum GC duration
# TYPE portfolio_backend_nodejs_gc_duration_seconds_sum counter
portfolio_backend_nodejs_gc_duration_seconds_sum ${rand(2, 8).toFixed(3)}
`.trim()
}

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(generateMetrics())
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<h1>Metrics Simulator</h1><p><a href="/metrics">/metrics</a></p>')
  }
})

server.listen(PORT, () => {
  console.log(`Metrics simulator on http://localhost:${PORT}/metrics`)
})
