const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test'){
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
  }
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    //return authorization.substring(7)
    return response.json(authorization.substring(7))
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log('errorrrr', error)
  if (error.name === 'ValidationError' || error.message === 'ValidationError'){
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

module.exports = { errorHandler, unknownEndpoint, requestLogger, tokenExtractor }
