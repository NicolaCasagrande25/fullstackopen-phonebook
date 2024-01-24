const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nicolacasagrande:${password}@phonebook.qj5apj7.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length < 5) {
    console.log('Please provide the name and number as arguments: node mongo.js <password> <name> <number>')
    process.exit(1)
} else {
    const contactToSave = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })

    contactToSave.save().then(result => {
        console.log(`added ${contactToSave.name} number ${contactToSave.number} to phonebook`)
        mongoose.connection.close()
    })
}