const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test'){
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')  
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.error('Ohhh noooo', error.message)
  if (error.name === 'ValidationError'){
    console.log('error')
    return res.status(400).json({ error: 'validation error' })
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint, requestLogger }
