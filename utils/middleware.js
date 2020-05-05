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
  console.log(error)
  if (error.name === 'ValidationError'){
    return res.status(400).json({ error: 'validation error' })
  } else if (error.message === 'password too short') {
    res.status(400).json({ error: error.message })
  } else{
    console.log('err', error)
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint, requestLogger }
