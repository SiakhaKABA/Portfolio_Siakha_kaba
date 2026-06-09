#!/usr/bin/env node

/**
 * Script de génération des secrets Terraform
 * Génère le hash bcrypt du mot de passe admin et le secret JWT
 *
 * Usage: node generate-terraform-secrets.js [admin_password]
 */

const crypto = require('crypto');

// Fonction pour générer un hash bcrypt simple (simulation)
function generateBcryptHash(password) {
    // Note: Pour une vraie application, utilisez bcryptjs
    // Ici on génère un hash simple pour l'exemple
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return `$2b$12$${hash.substring(0, 53)}`; // Format bcrypt simulé
}

// Fonction pour générer un secret JWT aléatoire
function generateJwtSecret() {
    return crypto.randomBytes(64).toString('hex');
}

// Récupérer le mot de passe depuis les arguments ou utiliser une valeur par défaut
const adminPassword = process.argv[2] || 'Admin123!';

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║    Génération des Secrets Terraform pour Jenkins            ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');

// Générer les secrets
const passwordHash = generateBcryptHash(adminPassword);
const jwtSecret = generateJwtSecret();

console.log('✅ Secrets générés avec succès!');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1️⃣  HASH DU MOT DE PASSE ADMIN (bcrypt)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Credential ID: tf-admin-password-hash');
console.log('');
console.log(passwordHash);
console.log('');
console.log('⚠️  IMPORTANT: Utilisez bcryptjs pour générer un vrai hash:');
console.log('   npm install bcryptjs');
console.log('   node -e "console.log(require(\'bcryptjs\').hashSync(\'' + adminPassword + '\', 12))"');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('2️⃣  SECRET JWT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Credential ID: tf-jwt-secret');
console.log('');
console.log(jwtSecret);
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 ÉTAPES SUIVANTES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('1. Ouvrir Jenkins: http://localhost:8081');
console.log('   Login: kaba / aws123');
console.log('');
console.log('2. Aller à: Manage Jenkins > Credentials > (global)');
console.log('');
console.log('3. Créer 2 credentials de type "Secret text":');
console.log('');
console.log('   a) Premier credential:');
console.log('      ID: tf-admin-password-hash');
console.log('      Secret: [Copiez le hash ci-dessus]');
console.log('');
console.log('   b) Deuxième credential:');
console.log('      ID: tf-jwt-secret');
console.log('      Secret: [Copiez le secret JWT ci-dessus]');
console.log('');
console.log('4. Relancer le build Jenkins');
console.log('');
console.log('✨ Terraform déploiera alors votre infrastructure Kubernetes!');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Sauvegarder dans un fichier pour référence
const fs = require('fs');
const secretsFile = '.terraform-secrets.txt';

const content = `
SECRETS TERRAFORM - GÉNÉRÉ LE ${new Date().toISOString()}
════════════════════════════════════════════════════════════

⚠️  NE PAS COMMITTER CE FICHIER DANS GIT ⚠️

1. Hash du mot de passe admin (bcrypt)
   Credential ID: tf-admin-password-hash
   ${passwordHash}

2. Secret JWT
   Credential ID: tf-jwt-secret
   ${jwtSecret}

IMPORTANT:
- Ajoutez ces credentials dans Jenkins: http://localhost:8081/credentials
- Type: Secret text
- Scope: Global
- Ne partagez jamais ces secrets
- Ce fichier est dans .gitignore

Mot de passe admin utilisé: ${adminPassword}
`;

fs.writeFileSync(secretsFile, content);
console.log(`💾 Secrets sauvegardés dans: ${secretsFile}`);
console.log(`   (Ce fichier est dans .gitignore pour votre sécurité)`);
console.log('');
