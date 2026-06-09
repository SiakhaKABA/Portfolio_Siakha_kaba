# ── Deployment Backend ────────────────────────────────────────────────────────
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = var.namespace
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name              = "backend"
          image             = "${var.dockerhub_repo}:backend-latest"
          image_pull_policy = "Always"

          port {
            container_port = 3001
          }

          # Variables d'environnement statiques
          env {
            name  = "PORT"
            value = "3001"
          }
          env {
            name  = "NODE_ENV"
            value = "production"
          }
          env {
            name  = "MONGO_URI"
            value = "mongodb://mongo:27017/portfolio"
          }

          # Variables depuis le Secret Kubernetes
          env {
            name = "ADMIN_PASSWORD_HASH"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.portfolio_secret.metadata[0].name
                key  = "ADMIN_PASSWORD_HASH"
              }
            }
          }
          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.portfolio_secret.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }

          resources {
            requests = {
              memory = "128Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "256Mi"
              cpu    = "500m"
            }
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 3001
            }
            initial_delay_seconds = 10
            period_seconds        = 5
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 3001
            }
            initial_delay_seconds = 15
            period_seconds        = 10
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_secret.portfolio_secret,
    kubernetes_service.mongo,
  ]
}

# ── Service Backend ───────────────────────────────────────────────────────────
resource "kubernetes_service" "backend" {
  metadata {
    name      = "backend"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      port        = 3001
      target_port = 3001
    }

    type = "ClusterIP"
  }
}
