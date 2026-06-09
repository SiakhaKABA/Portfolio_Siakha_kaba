# ── Outputs ──────────────────────────────────────────────────────────────────
output "frontend_url" {
  description = "URL d'accès au frontend"
  value       = "http://localhost:${var.frontend_node_port}"
}

output "backend_service" {
  description = "Service backend interne"
  value       = "http://backend:3001"
}

output "mongo_service" {
  description = "Service MongoDB interne"
  value       = "mongodb://mongo:27017/portfolio"
}

output "namespace" {
  description = "Namespace Kubernetes utilisé"
  value       = var.namespace
}

output "backend_image" {
  description = "Image Docker backend déployée"
  value       = "${var.dockerhub_repo}:backend-${var.backend_image_tag}"
}

output "frontend_image" {
  description = "Image Docker frontend déployée"
  value       = "${var.dockerhub_repo}:frontend-${var.frontend_image_tag}"
}
