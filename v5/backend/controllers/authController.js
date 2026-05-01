const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')

/**
 * POST /api/auth/login
 * Body : { password: "..." }
 * Retourne un JWT valable 8h si le mot de passe est correct.
 */
exports.login = async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' })
    }

    const hash = process.env.ADMIN_PASSWORD_HASH
    if (!hash) {
      return res.status(500).json({ message: 'Configuration serveur manquante' })
    }

    const isValid = await bcrypt.compare(password, hash)
    if (!isValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' })
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
