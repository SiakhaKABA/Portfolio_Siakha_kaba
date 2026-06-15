# ── Deployment Frontend ───────────────────────────────────────────────────────
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = var.namespace
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name              = "frontend"
          image             = "${var.dockerhub_repo}:frontend-${var.frontend_image_tag}"
          image_pull_policy = "Always"

          port {
            container_port = 80
          }

          resources {
            requests = {
              memory = "64Mi"
              cpu    = "50m"
            }
            limits = {
              memory = "128Mi"
              cpu    = "200m"
            }
          }
        }
      }
    }
  }

  depends_on = [kubernetes_service.backend]
}

# ── Service Frontend (NodePort) ───────────────────────────────────────────────
resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = "frontend"
    }

    port {
      port        = 80
      target_port = 80
      node_port   = var.frontend_node_port
    }

    type = "NodePort"
  }
}
