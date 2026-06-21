const http = require('http')

const PORT = 9999

let buildNumber = 126
let successBuilds = 118
let failedBuilds = 8
let totalDuration = 0

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function generateMetrics() {
  const now = Date.now()

  // Simulate occasional new build
  if (Math.random() < 0.05) {
    buildNumber++
    if (Math.random() < 0.85) {
      successBuilds++
    } else {
      failedBuilds++
    }
    totalDuration += randomBetween(120, 360)
  }

  const queueSize = Math.floor(randomBetween(0, 3))
  const executorsInUse = Math.floor(randomBetween(0, 3))
  const executorsTotal = 4

  // Jenkins metrics
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
jenkins_executor_count_value ${executorsTotal}
# HELP jenkins_builds_success_total Total successful builds
# TYPE jenkins_builds_success_total counter
jenkins_builds_success_total ${successBuilds}
# HELP jenkins_builds_failed_total Total failed builds
# TYPE jenkins_builds_failed_total counter
jenkins_builds_failed_total ${failedBuilds}
# HELP jenkins_builds_total_total Total builds
# TYPE jenkins_builds_total_total counter
jenkins_builds_total_total ${buildNumber}
# HELP jenkins_builds_duration_seconds Build duration
# TYPE jenkins_builds_duration_seconds histogram
jenkins_builds_duration_seconds_bucket{le="60"} ${Math.floor(buildNumber * 0.1)}
jenkins_builds_duration_seconds_bucket{le="120"} ${Math.floor(buildNumber * 0.3)}
jenkins_builds_duration_seconds_bucket{le="180"} ${Math.floor(buildNumber * 0.6)}
jenkins_builds_duration_seconds_bucket{le="300"} ${Math.floor(buildNumber * 0.85)}
jenkins_builds_duration_seconds_bucket{le="600"} ${Math.floor(buildNumber * 0.95)}
jenkins_builds_duration_seconds_bucket{le="+Inf"} ${buildNumber}
jenkins_builds_duration_seconds_sum ${totalDuration.toFixed(1)}
jenkins_builds_duration_seconds_count ${buildNumber}
# HELP jenkins_builds_last_duration_seconds Last build duration
# TYPE jenkins_builds_last_duration_seconds gauge
jenkins_builds_last_duration_seconds{job="PortfolioSonar"} ${randomBetween(180, 320).toFixed(1)}
# HELP jenkins_node_online Jenkins node online status
# TYPE jenkins_node_online gauge
jenkins_node_online{node="master"} 1
# HELP jenkins_plugins_active Number of active plugins
# TYPE jenkins_plugins_active gauge
jenkins_plugins_active 42
# HELP jenkins_job_count_value Total number of jobs
# TYPE jenkins_job_count_value gauge
jenkins_job_count_value 3
`

  // SonarQube metrics
  const sonar = `
# HELP sonarqube_up SonarQube instance status
# TYPE sonarqube_up gauge
sonarqube_up 1
# HELP sonarqube_health SonarQube health status (1=GREEN)
# TYPE sonarqube_health gauge
sonarqube_health 1
# HELP sonarqube_projects_total Total projects analyzed
# TYPE sonarqube_projects_total gauge
sonarqube_projects_total 1
# HELP sonarqube_issues_total Total issues by severity
# TYPE sonarqube_issues_total gauge
sonarqube_issues_total{severity="BLOCKER"} 0
sonarqube_issues_total{severity="CRITICAL"} 0
sonarqube_issues_total{severity="MAJOR"} ${Math.floor(randomBetween(5, 15))}
sonarqube_issues_total{severity="MINOR"} ${Math.floor(randomBetween(20, 40))}
sonarqube_issues_total{severity="INFO"} ${Math.floor(randomBetween(50, 80))}
# HELP sonarqube_coverage_percent Code coverage percentage
# TYPE sonarqube_coverage_percent gauge
sonarqube_coverage_percent{project="Portfolio-Siakha-KABA"} ${randomBetween(0, 5).toFixed(1)}
# HELP sonarqube_duplications_percent Code duplication percentage
# TYPE sonarqube_duplications_percent gauge
sonarqube_duplications_percent{project="Portfolio-Siakha-KABA"} ${randomBetween(0, 2).toFixed(1)}
# HELP sonarqube_quality_gate Quality gate status (1=OK, 0=ERROR)
# TYPE sonarqube_quality_gate gauge
sonarqube_quality_gate{project="Portfolio-Siakha-KABA"} 1
# HELP sonarqube_lines_of_code Total lines of code
# TYPE sonarqube_lines_of_code gauge
sonarqube_lines_of_code{project="Portfolio-Siakha-KABA"} 2100
# HELP sonarqube_vulnerabilities Total vulnerabilities
# TYPE sonarqube_vulnerabilities gauge
sonarqube_vulnerabilities{project="Portfolio-Siakha-KABA"} 0
# HELP sonarqube_bugs Total bugs
# TYPE sonarqube_bugs gauge
sonarqube_bugs{project="Portfolio-Siakha-KABA"} ${Math.floor(randomBetween(0, 3))}
# HELP sonarqube_code_smells Total code smells
# TYPE sonarqube_code_smells gauge
sonarqube_code_smells{project="Portfolio-Siakha-KABA"} ${Math.floor(randomBetween(140, 160))}
# HELP sonarqube_reliability_rating Reliability rating (A=1, E=5)
# TYPE sonarqube_reliability_rating gauge
sonarqube_reliability_rating{project="Portfolio-Siakha-KABA"} 3
# HELP sonarqube_security_rating Security rating (A=1, E=5)
# TYPE sonarqube_security_rating gauge
sonarqube_security_rating{project="Portfolio-Siakha-KABA"} 1
`

  // GitHub metrics
  const github = `
# HELP github_repo_stars Total stars
# TYPE github_repo_stars gauge
github_repo_stars{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} ${Math.floor(randomBetween(2, 5))}
# HELP github_repo_forks Total forks
# TYPE github_repo_forks gauge
github_repo_forks{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} ${Math.floor(randomBetween(0, 2))}
# HELP github_repo_open_issues Open issues
# TYPE github_repo_open_issues gauge
github_repo_open_issues{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} ${Math.floor(randomBetween(0, 3))}
# HELP github_repo_commits_total Total commits
# TYPE github_repo_commits_total counter
github_repo_commits_total{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA",branch="Siakha-KABA"} ${buildNumber + 50}
# HELP github_repo_pull_requests_open Open pull requests
# TYPE github_repo_pull_requests_open gauge
github_repo_pull_requests_open{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} ${Math.floor(randomBetween(0, 2))}
# HELP github_repo_watchers Total watchers
# TYPE github_repo_watchers gauge
github_repo_watchers{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} ${Math.floor(randomBetween(1, 4))}
# HELP github_repo_size_kb Repository size in KB
# TYPE github_repo_size_kb gauge
github_repo_size_kb{repo="Portfolio_Siakha_kaba",owner="SiakhaKABA"} 15200
`

  // Kubernetes metrics
  const podStatus = Math.random() < 0.95 ? 1 : 0
  const kube = `
# HELP kube_pod_status_phase Pod status phase
# TYPE kube_pod_status_phase gauge
kube_pod_status_phase{namespace="default",pod="backend-7d8f9b6c4-x2k9m",phase="Running"} ${podStatus}
kube_pod_status_phase{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",phase="Running"} ${podStatus}
kube_pod_status_phase{namespace="default",pod="mongodb-0",phase="Running"} 1
# HELP kube_pod_container_status_restarts_total Pod container restarts
# TYPE kube_pod_container_status_restarts_total counter
kube_pod_container_status_restarts_total{namespace="default",pod="backend-7d8f9b6c4-x2k9m",container="backend"} ${Math.floor(randomBetween(0, 3))}
kube_pod_container_status_restarts_total{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",container="frontend"} ${Math.floor(randomBetween(0, 2))}
kube_pod_container_status_restarts_total{namespace="default",pod="mongodb-0",container="mongodb"} 0
# HELP kube_deployment_status_replicas_available Available replicas
# TYPE kube_deployment_status_replicas_available gauge
kube_deployment_status_replicas_available{namespace="default",deployment="backend"} ${podStatus ? 1 : 0}
kube_deployment_status_replicas_available{namespace="default",deployment="frontend"} ${podStatus ? 1 : 0}
# HELP kube_deployment_spec_replicas Desired replicas
# TYPE kube_deployment_spec_replicas gauge
kube_deployment_spec_replicas{namespace="default",deployment="backend"} 1
kube_deployment_spec_replicas{namespace="default",deployment="frontend"} 1
# HELP kube_node_status_condition Node status
# TYPE kube_node_status_condition gauge
kube_node_status_condition{node="docker-desktop",condition="Ready",status="true"} 1
# HELP kube_pod_container_resource_requests CPU/Memory requests
# TYPE kube_pod_container_resource_requests gauge
kube_pod_container_resource_requests{namespace="default",pod="backend-7d8f9b6c4-x2k9m",resource="cpu"} 0.25
kube_pod_container_resource_requests{namespace="default",pod="backend-7d8f9b6c4-x2k9m",resource="memory"} 268435456
kube_pod_container_resource_requests{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",resource="cpu"} 0.1
kube_pod_container_resource_requests{namespace="default",pod="frontend-5c4d8e7f2-p8n3q",resource="memory"} 134217728
# HELP kube_service_info Service information
# TYPE kube_service_info gauge
kube_service_info{namespace="default",service="backend",type="ClusterIP"} 1
kube_service_info{namespace="default",service="frontend",type="NodePort"} 1
kube_service_info{namespace="default",service="mongodb",type="ClusterIP"} 1
`

  // Terraform metrics
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
# HELP terraform_apply_duration_seconds Last terraform apply duration
# TYPE terraform_apply_duration_seconds gauge
terraform_apply_duration_seconds ${randomBetween(15, 45).toFixed(1)}
# HELP terraform_plan_changes Planned changes in last run
# TYPE terraform_plan_changes gauge
terraform_plan_changes{action="add"} ${Math.floor(randomBetween(0, 2))}
terraform_plan_changes{action="change"} ${Math.floor(randomBetween(0, 3))}
terraform_plan_changes{action="destroy"} 0
# HELP terraform_state_drift Terraform state drift detected (0=no, 1=yes)
# TYPE terraform_state_drift gauge
terraform_state_drift 0
`

  // Blackbox / HTTP probes
  const blackbox = `
# HELP probe_success Probe success (1=up, 0=down)
# TYPE probe_success gauge
probe_success{instance="http://host.docker.internal:8080/login",job="blackbox-http"} 1
probe_success{instance="http://host.docker.internal:9000",job="blackbox-http"} 1
probe_success{instance="https://github.com/Siakha-KABA",job="blackbox-http"} 1
# HELP probe_duration_seconds Probe duration
# TYPE probe_duration_seconds gauge
probe_duration_seconds{instance="http://host.docker.internal:8080/login",job="blackbox-http"} ${randomBetween(0.05, 0.3).toFixed(3)}
probe_duration_seconds{instance="http://host.docker.internal:9000",job="blackbox-http"} ${randomBetween(0.1, 0.5).toFixed(3)}
probe_duration_seconds{instance="https://github.com/Siakha-KABA",job="blackbox-http"} ${randomBetween(0.2, 0.8).toFixed(3)}
# HELP probe_http_status_code HTTP status code
# TYPE probe_http_status_code gauge
probe_http_status_code{instance="http://host.docker.internal:8080/login",job="blackbox-http"} 200
probe_http_status_code{instance="http://host.docker.internal:9000",job="blackbox-http"} 200
probe_http_status_code{instance="https://github.com/Siakha-KABA",job="blackbox-http"} 200
`

  // Pipeline metrics (custom)
  const pipeline = `
# HELP pipeline_stage_duration_seconds Duration of each pipeline stage
# TYPE pipeline_stage_duration_seconds gauge
pipeline_stage_duration_seconds{stage="checkout"} ${randomBetween(2, 8).toFixed(1)}
pipeline_stage_duration_seconds{stage="sonarqube"} ${randomBetween(25, 60).toFixed(1)}
pipeline_stage_duration_seconds{stage="build_backend"} ${randomBetween(30, 90).toFixed(1)}
pipeline_stage_duration_seconds{stage="build_frontend"} ${randomBetween(40, 100).toFixed(1)}
pipeline_stage_duration_seconds{stage="push_docker"} ${randomBetween(20, 60).toFixed(1)}
pipeline_stage_duration_seconds{stage="terraform_init"} ${randomBetween(5, 15).toFixed(1)}
pipeline_stage_duration_seconds{stage="terraform_plan"} ${randomBetween(10, 25).toFixed(1)}
pipeline_stage_duration_seconds{stage="terraform_apply"} ${randomBetween(15, 45).toFixed(1)}
pipeline_stage_duration_seconds{stage="rollout"} ${randomBetween(30, 90).toFixed(1)}
# HELP pipeline_total_duration_seconds Total pipeline duration
# TYPE pipeline_total_duration_seconds gauge
pipeline_total_duration_seconds ${randomBetween(180, 360).toFixed(1)}
# HELP pipeline_success_rate Pipeline success rate
# TYPE pipeline_success_rate gauge
pipeline_success_rate ${(successBuilds / buildNumber * 100).toFixed(1)}
`

  return (jenkins + sonar + github + kube + terraform + blackbox + pipeline).trim()
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
