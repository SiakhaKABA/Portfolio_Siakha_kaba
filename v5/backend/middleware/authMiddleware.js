const jwt = require('jsonwebtoken')

/**
 * Middleware — vérifie le token JWT dans le header Authorization.
 * Usage : router.post('/', authMiddleware, ctrl.create)
 */
module.exports = (req, res, next) => {
  const header = req.headers['authorization'] || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé : token manquant' })
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' })
  }
}
