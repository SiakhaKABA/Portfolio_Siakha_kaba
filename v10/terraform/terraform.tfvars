# ── Configuration PortfolioSonar ─────────────────────────────────────────────
# Ce fichier contient les valeurs non-sensibles.
# Les secrets (admin_password_hash, jwt_secret) sont injectés
# via des variables d'environnement TF_VAR_* dans le Jenkinsfile.

kubeconfig_path    = "C:\\ProgramData\\Jenkins\\.jenkins\\.kube\\config"
kube_context       = "docker-desktop"
namespace          = "default"
dockerhub_repo     = "siakhakaba19/portfolio"
mongo_storage_size = "1Gi"
frontend_node_port = 30080

# Les tags d'image sont passés dynamiquement par Jenkins :
# -var="backend_image_tag=${BUILD_NUMBER}"
# -var="frontend_image_tag=${BUILD_NUMBER}"
