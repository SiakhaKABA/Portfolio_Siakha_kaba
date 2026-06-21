const client = require('prom-client')
const mongoose = require('mongoose')

const register = new client.Registry()

register.setDefaultLabels({ app: 'portfolio-backend' })

client.collectDefaultMetrics({
  register,
  prefix: 'portfolio_backend_'
})

// ── HTTP ────────────────────────────────────────────────
const httpRequestDuration = new client.Histogram({
  name: 'portfolio_backend_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
})

const httpRequestsTotal = new client.Counter({
  name: 'portfolio_backend_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
})

const httpRequestSize = new client.Histogram({
  name: 'portfolio_backend_http_request_size_bytes',
  help: 'Size of HTTP request bodies in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000, 10000000],
  registers: [register]
})

const httpResponseSize = new client.Histogram({
  name: 'portfolio_backend_http_response_size_bytes',
  help: 'Size of HTTP response bodies in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000, 10000000],
  registers: [register]
})

const httpActiveConnections = new client.Gauge({
  name: 'portfolio_backend_http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register]
})

// ── Authentification ────────────────────────────────────
const authAttemptsTotal = new client.Counter({
  name: 'portfolio_backend_auth_attempts_total',
  help: 'Total authentication attempts',
  labelNames: ['status'],
  registers: [register]
})

const authFailedConsecutive = new client.Gauge({
  name: 'portfolio_backend_auth_failed_consecutive',
  help: 'Number of consecutive failed authentication attempts',
  registers: [register]
})

// ── MongoDB ─────────────────────────────────────────────
const mongoConnectionState = new client.Gauge({
  name: 'portfolio_backend_mongo_connection_state',
  help: 'MongoDB connection state (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)',
  registers: [register]
})

const mongoOperationsTotal = new client.Counter({
  name: 'portfolio_backend_mongo_operations_total',
  help: 'Total number of MongoDB operations',
  labelNames: ['operation', 'collection', 'status'],
  registers: [register]
})

const mongoOperationDuration = new client.Histogram({
  name: 'portfolio_backend_mongo_operation_duration_seconds',
  help: 'Duration of MongoDB operations in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
  registers: [register]
})

const mongoConnectionPoolSize = new client.Gauge({
  name: 'portfolio_backend_mongo_connection_pool_size',
  help: 'Number of connections in the MongoDB pool',
  registers: [register]
})

// ── CRUD applicatif ─────────────────────────────────────
const crudOperationsTotal = new client.Counter({
  name: 'portfolio_backend_crud_operations_total',
  help: 'Total CRUD operations by resource and action',
  labelNames: ['resource', 'action', 'status'],
  registers: [register]
})

// ── Santé applicative ───────────────────────────────────
const appUptime = new client.Gauge({
  name: 'portfolio_backend_uptime_seconds',
  help: 'Application uptime in seconds',
  registers: [register]
})

const appInfo = new client.Gauge({
  name: 'portfolio_backend_info',
  help: 'Application info',
  labelNames: ['version', 'node_version'],
  registers: [register]
})

const appErrors = new client.Counter({
  name: 'portfolio_backend_errors_total',
  help: 'Total unhandled application errors',
  labelNames: ['type'],
  registers: [register]
})

// ── Initialisation ──────────────────────────────────────
appInfo.set({ version: '1.0.0', node_version: process.version }, 1)

setInterval(() => {
  appUptime.set(process.uptime())

  if (mongoose.connection) {
    mongoConnectionState.set(mongoose.connection.readyState)
  }

  const pool = mongoose.connection?.client?.topology?.s?.pool
  if (pool) {
    mongoConnectionPoolSize.set(pool.totalConnectionCount || 0)
  }
}, 5000)

// Mongoose plugin pour mesurer les queries
function mongooseMetricsPlugin(schema) {
  const ops = ['find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete',
    'countDocuments', 'aggregate', 'insertMany', 'updateMany', 'deleteMany']

  ops.forEach(op => {
    schema.pre(op, function () {
      this._metricsStart = process.hrtime.bigint()
    })
    schema.post(op, function () {
      if (this._metricsStart) {
        const duration = Number(process.hrtime.bigint() - this._metricsStart) / 1e9
        const collection = this.model?.collection?.name || this.mongooseCollection?.name || 'unknown'
        mongoOperationDuration.observe({ operation: op, collection }, duration)
        mongoOperationsTotal.inc({ operation: op, collection, status: 'success' })
      }
    })
  })

  schema.post('save', function () {
    const collection = this.constructor.collection.name
    mongoOperationsTotal.inc({ operation: 'save', collection, status: 'success' })
  })
}

// ── Middleware HTTP ──────────────────────────────────────
let consecutiveAuthFailures = 0

function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') return next()

  const start = process.hrtime.bigint()
  httpActiveConnections.inc()

  const reqSize = Number.parseInt(req.headers['content-length'] || '0', 10)

  res.on('finish', () => {
    httpActiveConnections.dec()
    const duration = Number(process.hrtime.bigint() - start) / 1e9
    const route = req.route ? req.route.path : req.path
    const labels = { method: req.method, route, status_code: res.statusCode }

    httpRequestDuration.observe(labels, duration)
    httpRequestsTotal.inc(labels)

    if (reqSize > 0) {
      httpRequestSize.observe({ method: req.method, route }, reqSize)
    }
    const resSize = Number.parseInt(res.getHeader('content-length') || '0', 10)
    if (resSize > 0) {
      httpResponseSize.observe({ method: req.method, route }, resSize)
    }
  })

  next()
}

// ── Helpers pour les controllers ────────────────────────
function trackAuth(success) {
  if (success) {
    authAttemptsTotal.inc({ status: 'success' })
    consecutiveAuthFailures = 0
  } else {
    authAttemptsTotal.inc({ status: 'failure' })
    consecutiveAuthFailures++
  }
  authFailedConsecutive.set(consecutiveAuthFailures)
}

function trackCrud(resource, action, success) {
  crudOperationsTotal.inc({ resource, action, status: success ? 'success' : 'error' })
}

function trackError(type) {
  appErrors.inc({ type })
}

module.exports = {
  metricsMiddleware,
  register,
  trackAuth,
  trackCrud,
  trackError,
  mongooseMetricsPlugin
}
