require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Contact = require('./models/contact')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))

let contacts = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response, next) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${date}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    if (contact) {
        response.json(contact)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
        .then(result => { response.status(204).end() })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const person = new Contact({
        name: request.body.name,
        number: request.body.number
    })

    if (!person.name) {
        return response.status(400).json({
            error: 'the name of the contact is missing'
        })
    }
    else if (!person.number) {
        return response.status(400).json({
            error: 'the number of the contact is missing'
        })
    }
    // else if (contacts.find(contact => contact.name === person.name)) {
    //     return response.status(409).json({
    //         error: `${person.name} is already added to phonebook`
    //     })
    // }

    person.save().then(savedPerson => {
        response.status(201).json(savedPerson)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})