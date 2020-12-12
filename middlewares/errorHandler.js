module.exports = function (err, req, res, next) {
  const errors = []
  let status = err.status || 500
  let error = err.msg || 'Internal Server Error'
  if (err.name === 'SequelizeValidationError') {
    err.errors.map(el => {
      errors.push(el.message)
    })
    status = 400
    error = errors.join(", ")
  }
  res.status(status).json({ error })
}