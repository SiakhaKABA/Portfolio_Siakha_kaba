# ── Secret : identifiants admin ─────────────────────────────────────────────
resource "kubernetes_secret" "portfolio_secret" {
  metadata {
    name      = "portfolio-secret"
    namespace = var.namespace
  }

  type = "Opaque"

  string_data = {
    ADMIN_PASSWORD_HASH = var.admin_password_hash
    JWT_SECRET          = var.jwt_secret
  }
}
