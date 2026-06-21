const http = require('http')

const PORT = 9999

let buildNumber = 126
let successBuilds = 118
let failedBuilds = 8
let totalDuration = 14580
let httpRequestsTotal = { GET200: 4520, GET404: 85, POST201: 312, POST400: 23, PUT200: 156, DELETE200: 48, GET500: 12 }
let mongoOps = { find: 3200, insertOne: 312, updateOne: 156, deleteOne: 48 }

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function generateMetrics() {
  // Simulate traffic
  httpRequestsTotal.GET200 += Math.floor(rand(1, 8))
  httpRequestsTotal.GET404 += Math.random() < 0.3 ? 1 : 0
  httpRequestsTotal.POST201 += Math.random() < 0.2 ? 1 : 0
  httpRequestsTotal.POST400 += Math.random() < 0.05 ? 1 : 0
  httpRequestsTotal.PUT200 += Math.random() < 0.15 ? 1 : 0
  httpRequestsTotal.DELETE200 += Math.random() < 0.05 ? 1 : 0
  httpRequestsTotal.GET500 += Math.random() < 0.02 ? 1 : 0
  mongoOps.find += Math.floor(rand(1, 6))
  mongoOps.insertOne += Math.random() < 0.2 ? 1 : 0
  mongoOps.updateOne += Math.random() < 0.15 ? 1 : 0
  mongoOps.deleteOne += Math.random() < 0.05 ? 1 : 0

  // Simulate occasional new build
  if (Math.random() < 0.03) {
    buildNumber++
    totalDuration += rand(180, 360)
    if (Math.random() < 0.85) successBuilds++
    else failedBuilds++
  }

  const totalHTTP = Object.values(httpRequestsTotal).reduce((a, b) => a + b, 0)
  const heapUsed = Math.floor(rand(45, 75) * 1024 * 1024)
  const heapTotal = Math.floor(rand(80, 120) * 1024 * 1024)
  const rss = Math.floor(rand(100, 160) * 1024 * 1024)

  // ════════════════════════════════════════════════════════════════
  // PORTFOLIO BACKEND METRICS
  // ════════════════════════════════════════════════════════════════
  const backend = `
# HELP portfolio_backend_http_requests_total Total HTTP requests
# TYPE portfolio_backend_http_requests_total counter
portfolio_backend_http_requests_total{method="GET",route="/api/projets",status_code="200"} ${httpRequestsTotal.GET200}
portfolio_backend_http_requests_total{method="GET",route="/api/projets",status_code="404"} ${httpRequestsTotal.GET404}
portfolio_backend_http_requests_total{method="GET",route="/api/formations",status_code="200"} ${Math.floor(httpRequestsTotal.GET200 * 0.6)}
portfolio_backend_http_requests_total{method="GET",route="/api/competences",status_code="200"} ${Math.floor(httpRequestsTotal.GET200 * 0.5)}
portfolio_backend_http_requests_total{method="GET",route="/api/experiences",status_code="200"} ${Math.floor(httpRequestsTotal.GET200 * 0.4)}
portfolio_backend_http_requests_total{method="GET",route="/api/certifications",status_code="200"} ${Math.floor(httpRequestsTotal.GET200 * 0.35)}
portfolio_backend_http_requests_total{method="POST",route="/api/projets",status_code="201"} ${httpRequestsTotal.POST201}
portfolio_backend_http_requests_total{method="POST",route="/api/projets",status_code="400"} ${httpRequestsTotal.POST400}
portfolio_backend_http_requests_total{method="PUT",route="/api/projets/:id",status_code="200"} ${httpRequestsTotal.PUT200}
portfolio_backend_http_requests_total{method="DELETE",route="/api/projets/:id",status_code="200"} ${httpRequestsTotal.DELETE200}
portfolio_backend_http_requests_total{method="GET",route="/api/projets",status_code="500"} ${httpRequestsTotal.GET500}
portfolio_backend_http_requests_total{method="POST",route="/api/auth/login",status_code="200"} ${Math.floor(httpRequestsTotal.POST201 * 0.8)}
portfolio_backend_http_requests_total{method="POST",route="/api/auth/login",status_code="401"} ${Math.floor(rand(5, 20))}
# HELP portfolio_backend_http_request_duration_seconds HTTP request duration
# TYPE portfolio_backend_http_request_duration_seconds histogram
portfolio_backend_http_request_duration_seconds_bucket{le="0.005"} ${Math.floor(totalHTTP * 0.15)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.01"} ${Math.floor(totalHTTP * 0.35)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.025"} ${Math.floor(totalHTTP * 0.55)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.05"} ${Math.floor(totalHTTP * 0.7)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.1"} ${Math.floor(totalHTTP * 0.85)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.25"} ${Math.floor(totalHTTP * 0.93)}
portfolio_backend_http_request_duration_seconds_bucket{le="0.5"} ${Math.floor(totalHTTP * 0.97)}
portfolio_backend_http_request_duration_seconds_bucket{le="1"} ${Math.floor(totalHTTP * 0.99)}
portfolio_backend_http_request_duration_seconds_bucket{le="2.5"} ${Math.floor(totalHTTP * 0.998)}
portfolio_backend_http_request_duration_seconds_bucket{le="+Inf"} ${totalHTTP}
portfolio_backend_http_request_duration_seconds_sum ${(totalHTTP * 0.045).toFixed(2)}
portfolio_backend_http_request_duration_seconds_count ${totalHTTP}
# HELP portfolio_backend_mongo_operations_total MongoDB operations
# TYPE portfolio_backend_mongo_operations_total counter
portfolio_backend_mongo_operations_total{operation="find"} ${mongoOps.find}
portfolio_backend_mongo_operations_total{operation="insertOne"} ${mongoOps.insertOne}
portfolio_backend_mongo_operations_total{operation="updateOne"} ${mongoOps.updateOne}
portfolio_backend_mongo_operations_total{operation="deleteOne"} ${mongoOps.deleteOne}
# HELP portfolio_backend_mongo_operation_duration_seconds MongoDB operation duration
# TYPE portfolio_backend_mongo_operation_duration_seconds histogram
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.001"} ${Math.floor(mongoOps.find * 0.3)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.005"} ${Math.floor(mongoOps.find * 0.6)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.01"} ${Math.floor(mongoOps.find * 0.8)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.05"} ${Math.floor(mongoOps.find * 0.95)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="0.1"} ${Math.floor(mongoOps.find * 0.99)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="find",le="+Inf"} ${mongoOps.find}
portfolio_backend_mongo_operation_duration_seconds_sum{operation="find"} ${(mongoOps.find * 0.008).toFixed(2)}
portfolio_backend_mongo_operation_duration_seconds_count{operation="find"} ${mongoOps.find}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.001"} ${Math.floor(mongoOps.insertOne * 0.2)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.005"} ${Math.floor(mongoOps.insertOne * 0.5)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.01"} ${Math.floor(mongoOps.insertOne * 0.75)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.05"} ${Math.floor(mongoOps.insertOne * 0.92)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="0.1"} ${Math.floor(mongoOps.insertOne * 0.98)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="insertOne",le="+Inf"} ${mongoOps.insertOne}
portfolio_backend_mongo_operation_duration_seconds_sum{operation="insertOne"} ${(mongoOps.insertOne * 0.012).toFixed(2)}
portfolio_backend_mongo_operation_duration_seconds_count{operation="insertOne"} ${mongoOps.insertOne}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="updateOne",le="0.001"} ${Math.floor(mongoOps.updateOne * 0.2)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="updateOne",le="0.005"} ${Math.floor(mongoOps.updateOne * 0.5)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="updateOne",le="0.01"} ${Math.floor(mongoOps.updateOne * 0.7)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="updateOne",le="0.05"} ${Math.floor(mongoOps.updateOne * 0.9)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="updateOne",le="0.1"} ${Math.floor(mongoOps.updateOne * 0.97)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="updateOne",le="+Inf"} ${mongoOps.updateOne}
portfolio_backend_mongo_operation_duration_seconds_sum{operation="updateOne"} ${(mongoOps.updateOne * 0.015).toFixed(2)}
portfolio_backend_mongo_operation_duration_seconds_count{operation="updateOne"} ${mongoOps.updateOne}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="deleteOne",le="0.001"} ${Math.floor(mongoOps.deleteOne * 0.3)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="deleteOne",le="0.005"} ${Math.floor(mongoOps.deleteOne * 0.6)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="deleteOne",le="0.01"} ${Math.floor(mongoOps.deleteOne * 0.8)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="deleteOne",le="0.05"} ${Math.floor(mongoOps.deleteOne * 0.95)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="deleteOne",le="0.1"} ${Math.floor(mongoOps.deleteOne * 0.99)}
portfolio_backend_mongo_operation_duration_seconds_bucket{operation="deleteOne",le="+Inf"} ${mongoOps.deleteOne}
portfolio_backend_mongo_operation_duration_seconds_sum{operation="deleteOne"} ${(mongoOps.deleteOne * 0.006).toFixed(2)}
portfolio_backend_mongo_operation_duration_seconds_count{operation="deleteOne"} ${mongoOps.deleteOne}
# HELP portfolio_backend_process_resident_memory_bytes Process resident memory
# TYPE portfolio_backend_process_resident_memory_bytes gauge
portfolio_backend_process_resident_memory_bytes ${rss}
# HELP portfolio_backend_nodejs_heap_size_used_bytes Node.js heap used
# TYPE portfolio_backend_nodejs_heap_size_used_bytes gauge
portfolio_backend_nodejs_heap_size_used_bytes ${heapUsed}
# HELP portfolio_backend_nodejs_heap_size_total_bytes Node.js heap total
# TYPE portfolio_backend_nodejs_heap_size_total_bytes gauge
portfolio_backend_nodejs_heap_size_total_bytes ${heapTotal}
# HELP portfolio_backend_process_cpu_user_seconds_total CPU user time
# TYPE portfolio_backend_process_cpu_user_seconds_total counter
portfolio_backend_process_cpu_user_seconds_total ${(rand(50, 120)).toFixed(2)}
# HELP portfolio_backend_nodejs_eventloop_lag_seconds Event loop lag
# TYPE portfolio_backend_nodejs_eventloop_lag_seconds gauge
portfolio_backend_nodejs_eventloop_lag_seconds ${rand(0.001, 0.015).toFixed(4)}
# HELP portfolio_backend_nodejs_eventloop_lag_p99_seconds Event loop lag P99
# TYPE portfolio_backend_nodejs_eventloop_lag_p99_seconds gauge
portfolio_backend_nodejs_eventloop_lag_p99_seconds ${rand(0.005, 0.05).toFixed(4)}
# HELP portfolio_backend_nodejs_gc_duration_seconds_sum GC duration sum
# TYPE portfolio_backend_nodejs_gc_duration_seconds_sum counter
portfolio_backend_nodejs_gc_duration_seconds_sum ${rand(2, 8).toFixed(3)}
# HELP portfolio_backend_nodejs_active_handles Active handles
# TYPE portfolio_backend_nodejs_active_handles gauge
portfolio_backend_nodejs_active_handles ${Math.floor(rand(8, 20))}
# HELP portfolio_backend_nodejs_active_requests Active requests
# TYPE portfolio_backend_nodejs_active_requests gauge
portfolio_backend_nodejs_active_requests ${Math.floor(rand(0, 5))}
`

  // ════════════════════════════════════════════════════════════════
  // JENKINS METRICS
  // ════════════════════════════════════════════════════════════════
  const queueSize = Math.floor(rand(0, 2))
  const executorsInUse = Math.floor(rand(0, 3))

  const jenkins = `
# HELP jenkins_up Jenkins instance status
# TYPE jenkins_up gauge
jenkins_up 1
# HELP jenkins_queue_size_value Number of items in build queue
# TYPE jenkins_queue_size_value gauge
jenkins_queue_size_value ${queueSize}
# HELP jenkins_executor_in_use_value Number of executors in use
# TYPE jenkins_executor_in_use_value gauge
jenkins_executor_in_use_value ${executorsInUse}
# HELP jenkins_executor_count_value Total number of executors
# TYPE jenkins_executor_count_value gauge
jenkins_executor_count_value 4
# HELP jenkins_builds_success_total Total successful builds
# TYPE jenkins_builds_success_total counter
jenkins_builds_success_total ${successBuilds}
# HELP jenkins_builds_failed_total Total failed builds
# TYPE jenkins_builds_failed_total counter
jenkins_builds_failed_total ${failedBuilds}
# HELP jenkins_builds_total_total Total builds
# TYPE jenkins_builds_total_total counter
jenkins_builds_total_total ${buildNumber}
# HELP jenkins_builds_duration_seconds Build duration histogram
# TYPE jenkins_builds_duration_seconds histogram
jenkins_builds_duration_seconds_bucket{le="60"} ${Math.floor(buildNumber * 0.05)}
jenkins_builds_duration_seconds_bucket{le="120"} ${Math.floor(buildNumber * 0.15)}
jenkins_builds_duration_seconds_bucket{le="180"} ${Math.floor(buildNumber * 0.4)}
jenkins_builds_duration_seconds_bucket{le="300"} ${Math.floor(buildNumber * 0.75)}
jenkins_builds_duration_seconds_bucket{le="600"} ${Math.floor(buildNumber * 0.95)}
jenkins_builds_duration_seconds_bucket{le="+Inf"} ${buildNumber}
jenkins_builds_duration_seconds_sum ${totalDuration.toFixed(0)}
jenkins_builds_duration_seconds_count ${buildNumber}
# HELP jenkins_builds_last_duration_seconds Last build duration
# TYPE jenkins_builds_last_duration_seconds gauge
jenkins_builds_last_duration_seconds{job_name="PortfolioSonar"} ${rand(200, 340).toFixed(0)}
# HELP jenkins_builds_last_result Last build result (1=SUCCESS, 0=FAILURE)
# TYPE jenkins_builds_last_result gauge
jenkins_builds_last_result{job_name="PortfolioSonar"} 1
# HELP jenkins_node_online Jenkins node online status
# TYPE jenkins_node_online gauge
jenkins_node_online{node="master"} 1
# HELP jenkins_plugins_active Number of active plugins
# TYPE jenkins_plugins_active gauge
jenkins_plugins_active 42
# HELP jenkins_job_count_value Total number of jobs
# TYPE jenkins_job_count_value gauge
jenkins_job_count_value 3
# HELP jenkins_builds_success_rate Build success rate percentage
# TYPE jenkins_builds_success_rate gauge
jenkins_builds_success_rate ${(successBuilds / buildNumber * 100).toFixed(1)}
`

  // ════════════════════════════════════════════════════════════════
  // SONARQUBE METRICS
  // ════════════════════════════════════════════════════════════════
  const sonar = `
# HELP sonarqube_up SonarQube instance status
# TYPE sonarqube_up gauge
sonarqube_up 1
# HELP sonarqube_health SonarQube health (1=GREEN)
# TYPE sonarqube_health gauge
sonarqube_health 1
# HELP sonarqube_quality_gate Quality gate status (1=OK, 0=ERROR)
# TYPE sonarqube_quality_gate gauge
sonarqube_quality_gate{project="Portfolio-Siakha-KABA"} 1
# HELP sonarqube_issues_total Issues by severity
# TYPE sonarqube_issues_total gauge
sonarqube_issues_total{severity="BLOCKER"} 0
sonarqube_issues_total{severity="CRITICAL"} 0
sonarqube_issues_total{severity="MAJOR"} ${Math.floor(rand(8, 12))}
sonarqube_issues_total{severity="MINOR"} ${Math.floor(rand(25, 35))}
sonarqube_issues_total{severity="INFO"} ${Math.floor(rand(60, 75))}
# HELP sonarqube_coverage_percent Code coverage
# TYPE sonarqube_coverage_percent gauge
sonarqube_coverage_percent{project="Portfolio-Siakha-KABA"} 0.0
# HELP sonarqube_duplications_percent Duplications
# TYPE sonarqube_duplications_percent gauge
sonarqube_duplications_percent{project="Portfolio-Siakha-KABA"} 0.0
# HELP sonarqube_lines_of_code Lines of code
# TYPE sonarqube_lines_of_code gauge
sonarqube_lines_of_code{project="Portfolio-Siakha-KABA"} 2100
# HELP sonarqube_vulnerabilities Vulnerabilities count
# TYPE sonarqube_vulnerabilities gauge
sonarqube_vulnerabilities{project="Portfolio-Siakha-KABA"} 0
# HELP sonarqube_bugs Bugs count
# TYPE sonarqube_bugs gauge
sonarqube_bugs{project="Portfolio-Siakha-KABA"} 0
# HELP sonarqube_code_smells Code smells count
# TYPE sonarqube_code_smells gauge
sonarqube_code_smells{project="Portfolio-Siakha-KABA"} 153
# HELP sonarqube_new_issues New issues in new code
# TYPE sonarqube_new_issues gauge
sonarqube_new_issues{project="Portfolio-Siakha-KABA"} 0
`

  // ════════════════════════════════════════════════════════════════
  // GITHUB METRICS
  // ════════════════════════════════════════════════════════════════
  const github = `
# HELP github_repo_stars Total stars
# TYPE github_repo_stars gauge
github_repo_stars{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} 3
# HELP github_repo_forks Total forks
# TYPE github_repo_forks gauge
github_repo_forks{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} 1
# HELP github_repo_open_issues Open issues
# TYPE github_repo_open_issues gauge
github_repo_open_issues{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} ${Math.floor(rand(0, 2))}
# HELP github_repo_commits_total Total commits
# TYPE github_repo_commits_total counter
github_repo_commits_total{repo="Portfolio_Siakha_kaba",branch="Siakha-KABA"} ${buildNumber + 50}
# HELP github_repo_pull_requests_open Open PRs
# TYPE github_repo_pull_requests_open gauge
github_repo_pull_requests_open{repo="Portfolio_Siakha_kaba"} ${Math.floor(rand(0, 1))}
# HELP github_repo_watchers Watchers
# TYPE github_repo_watchers gauge
github_repo_watchers{repo="Portfolio_Siakha_kaba"} 2
# HELP github_repo_size_kb Repo size
# TYPE github_repo_size_kb gauge
github_repo_size_kb{repo="Portfolio_Siakha_kaba"} 15200
`

  // ════════════════════════════════════════════════════════════════
  // KUBERNETES METRICS
  // ════════════════════════════════════════════════════════════════
  const kube = `
# HELP kube_pod_status_phase Pod status
# TYPE kube_pod_status_phase gauge
kube_pod_status_phase{namespace="default",pod="backend-7d8f9b6c4-x2k9m",phase="Running"} 1
kube_pod_status_phase{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",phase="Running"} 1
kube_pod_status_phase{namespace="default",pod="mongodb-0",phase="Running"} 1
# HELP kube_pod_container_status_restarts_total Container restarts
# TYPE kube_pod_container_status_restarts_total counter
kube_pod_container_status_restarts_total{namespace="default",pod="backend-7d8f9b6c4-x2k9m",container="backend"} ${Math.floor(rand(0, 2))}
kube_pod_container_status_restarts_total{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",container="frontend"} 0
kube_pod_container_status_restarts_total{namespace="default",pod="mongodb-0",container="mongodb"} 0
# HELP kube_deployment_status_replicas_available Available replicas
# TYPE kube_deployment_status_replicas_available gauge
kube_deployment_status_replicas_available{namespace="default",deployment="backend"} 1
kube_deployment_status_replicas_available{namespace="default",deployment="frontend"} 1
# HELP kube_deployment_spec_replicas Desired replicas
# TYPE kube_deployment_spec_replicas gauge
kube_deployment_spec_replicas{namespace="default",deployment="backend"} 1
kube_deployment_spec_replicas{namespace="default",deployment="frontend"} 1
# HELP kube_node_status_condition Node condition
# TYPE kube_node_status_condition gauge
kube_node_status_condition{node="docker-desktop",condition="Ready",status="true"} 1
# HELP kube_service_info Service info
# TYPE kube_service_info gauge
kube_service_info{namespace="default",service="backend",type="ClusterIP"} 1
kube_service_info{namespace="default",service="frontend",type="NodePort"} 1
kube_service_info{namespace="default",service="mongodb",type="ClusterIP"} 1
`

  // ════════════════════════════════════════════════════════════════
  // TERRAFORM METRICS
  // ════════════════════════════════════════════════════════════════
  const terraform = `
# HELP terraform_resources_total Total managed resources
# TYPE terraform_resources_total gauge
terraform_resources_total{workspace="default"} 12
# HELP terraform_resources_by_type Resources by type
# TYPE terraform_resources_by_type gauge
terraform_resources_by_type{type="kubernetes_deployment"} 2
terraform_resources_by_type{type="kubernetes_service"} 3
terraform_resources_by_type{type="kubernetes_config_map"} 2
terraform_resources_by_type{type="kubernetes_secret"} 2
terraform_resources_by_type{type="kubernetes_namespace"} 1
terraform_resources_by_type{type="kubernetes_persistent_volume_claim"} 2
# HELP terraform_apply_duration_seconds Terraform apply duration
# TYPE terraform_apply_duration_seconds gauge
terraform_apply_duration_seconds ${rand(18, 42).toFixed(1)}
# HELP terraform_plan_changes Plan changes
# TYPE terraform_plan_changes gauge
terraform_plan_changes{action="add"} 0
terraform_plan_changes{action="change"} ${Math.floor(rand(0, 2))}
terraform_plan_changes{action="destroy"} 0
# HELP terraform_state_drift State drift detected
# TYPE terraform_state_drift gauge
terraform_state_drift 0
`

  // ════════════════════════════════════════════════════════════════
  // BLACKBOX / PROBE METRICS
  // ════════════════════════════════════════════════════════════════
  const probes = `
# HELP probe_success Probe success
# TYPE probe_success gauge
probe_success{instance="http://localhost:8080/login",job="blackbox-http"} 1
probe_success{instance="http://localhost:9000",job="blackbox-http"} 1
probe_success{instance="https://github.com/Siakha-KABA",job="blackbox-http"} 1
# HELP probe_duration_seconds Probe duration
# TYPE probe_duration_seconds gauge
probe_duration_seconds{instance="http://localhost:8080/login"} ${rand(0.08, 0.25).toFixed(3)}
probe_duration_seconds{instance="http://localhost:9000"} ${rand(0.1, 0.4).toFixed(3)}
probe_duration_seconds{instance="https://github.com/Siakha-KABA"} ${rand(0.2, 0.7).toFixed(3)}
# HELP probe_http_status_code HTTP status code
# TYPE probe_http_status_code gauge
probe_http_status_code{instance="http://localhost:8080/login"} 200
probe_http_status_code{instance="http://localhost:9000"} 200
probe_http_status_code{instance="https://github.com/Siakha-KABA"} 200
`

  // ════════════════════════════════════════════════════════════════
  // PIPELINE STAGE METRICS
  // ════════════════════════════════════════════════════════════════
  const pipeline = `
# HELP pipeline_stage_duration_seconds Pipeline stage duration
# TYPE pipeline_stage_duration_seconds gauge
pipeline_stage_duration_seconds{stage="checkout"} ${rand(3, 7).toFixed(1)}
pipeline_stage_duration_seconds{stage="sonarqube"} ${rand(30, 55).toFixed(1)}
pipeline_stage_duration_seconds{stage="build_backend"} ${rand(35, 80).toFixed(1)}
pipeline_stage_duration_seconds{stage="build_frontend"} ${rand(45, 95).toFixed(1)}
pipeline_stage_duration_seconds{stage="push_docker"} ${rand(20, 55).toFixed(1)}
pipeline_stage_duration_seconds{stage="terraform_init"} ${rand(5, 12).toFixed(1)}
pipeline_stage_duration_seconds{stage="terraform_plan"} ${rand(10, 22).toFixed(1)}
pipeline_stage_duration_seconds{stage="terraform_apply"} ${rand(15, 40).toFixed(1)}
pipeline_stage_duration_seconds{stage="rollout"} ${rand(30, 80).toFixed(1)}
# HELP pipeline_total_duration_seconds Total pipeline duration
# TYPE pipeline_total_duration_seconds gauge
pipeline_total_duration_seconds ${rand(200, 350).toFixed(1)}
`

  return (backend + jenkins + sonar + github + kube + terraform + probes + pipeline).trim()
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
  console.log(`Metrics simulator running on http://localhost:${PORT}/metrics`)
})
