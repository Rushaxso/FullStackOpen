const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.yl9idok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)