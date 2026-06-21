# ── PersistentVolumeClaim MongoDB ────────────────────────────────────────────
resource "kubernetes_persistent_volume_claim" "mongo_pvc" {
  metadata {
    name      = "mongo-pvc"
    namespace = var.namespace
  }

  spec {
    access_modes       = ["ReadWriteOnce"]
    storage_class_name = "hostpath"

    resources {
      requests = {
        storage = var.mongo_storage_size
      }
    }
  }

  # Empêche Terraform de recréer le PVC si des données existent déjà
  lifecycle {
    prevent_destroy = false
  }
}

# ── Deployment MongoDB ────────────────────────────────────────────────────────
resource "kubernetes_deployment" "mongo" {
  metadata {
    name      = "mongo"
    namespace = var.namespace
    labels = {
      app = "mongo"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "mongo"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongo"
        }
      }

      spec {
        container {
          name  = "mongo"
          image = "mongo:7"

          port {
            container_port = 27017
          }

          volume_mount {
            name       = "mongo-storage"
            mount_path = "/data/db"
          }

          resources {
            requests = {
              memory = "256Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "512Mi"
              cpu    = "500m"
            }
          }
        }

        volume {
          name = "mongo-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.mongo_pvc.metadata[0].name
          }
        }
      }
    }
  }

  depends_on = [kubernetes_persistent_volume_claim.mongo_pvc]
}

# ── Service MongoDB ───────────────────────────────────────────────────────────
resource "kubernetes_service" "mongo" {
  metadata {
    name      = "mongo"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = "mongo"
    }

    port {
      port        = 27017
      target_port = 27017
    }

    type = "ClusterIP"
  }
}
