const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(morgan('tiny'))
app.use(express.json())

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

app.get('/api/persons', (request, response) => {
    response.json(contacts);
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body

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
    else if (contacts.find(contact => contact.name === person.name)) {
        return response.status(409).json({
            error: `${person.name} is already added to phonebook`
        })
    }

    person.id = Math.floor(Math.random() * 99999999) + 1
    contacts = contacts.concat(person)

    response.status(201).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})