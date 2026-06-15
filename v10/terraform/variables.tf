variable "kubeconfig_path" {
  description = "Chemin vers le fichier kubeconfig"
  type        = string
  default     = "C:\\ProgramData\\Jenkins\\.jenkins\\.kube\\config"
}

variable "kube_context" {
  description = "Contexte Kubernetes à utiliser"
  type        = string
  default     = "docker-desktop"
}

variable "namespace" {
  description = "Namespace Kubernetes"
  type        = string
  default     = "default"
}

variable "dockerhub_repo" {
  description = "Repository Docker Hub"
  type        = string
  default     = "siakhakaba19/portfolio"
}

variable "backend_image_tag" {
  description = "Tag de l'image backend"
  type        = string
  default     = "latest"
}

variable "frontend_image_tag" {
  description = "Tag de l'image frontend"
  type        = string
  default     = "latest"
}

variable "admin_password_hash" {
  description = "Hash bcrypt du mot de passe admin"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret JWT"
  type        = string
  sensitive   = true
}

variable "mongo_storage_size" {
  description = "Taille du stockage MongoDB"
  type        = string
  default     = "1Gi"
}

variable "frontend_node_port" {
  description = "NodePort exposé pour le frontend"
  type        = number
  default     = 30080
}
