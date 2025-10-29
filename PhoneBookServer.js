import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Person from './models/person.js'

console.log('Environment variables loaded:')
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND')
console.log('PORT:', process.env.PORT)

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log('---')
  console.log('Request received!')
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('---')
  next()
})


//This is kind of like a homepage
app.get('/',(request,response)=>{
  response.send(`
    <h1>This is the in process backend of a phonebook</h1>
  `)
})
// GET all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// PUT update person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Info route
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const count = persons.length
    const time = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    `)
  })
})

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Person from './models/person.js'

console.log('Environment variables loaded:')
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND')
console.log('PORT:', process.env.PORT)

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log('---')
  console.log('Request received!')
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('---')
  next()
})


//This is kind of like a homepage
app.get('/',(request,response)=>{
  response.send(`
    <h1>This is the in process backend of a phonebook</h1>
  `)
})
// GET all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// PUT update person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Info route
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const count = persons.length
    const time = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    `)
  })
})

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
