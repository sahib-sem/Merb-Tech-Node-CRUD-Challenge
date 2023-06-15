const express = require('express')
const app = express()
const JOI = require('joi')
const uuid = require('uuid')
const cors = require('cors')



let persons = [{
    id: '1',
    name: 'Sam',
    age: '26',
    hobbies: []    
}] //This is your in memory database

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))




app.set('db', persons)
//TODO: Implement crud of person



app.get('/person', (req, res) => {
    res.json(persons);
})



app.get('/person/:id', (req, res) => {

    const found = persons.some((p) => p.id == req.params.id);

    if (found){
        res.json(persons.filter((p) => p.id == req.params.id)[0])
    }
    else{
        res.status(404).json({msg: `person with id ${req.params.id} not found`})
    }
})


app.post('/person' , (req, res) => {
    const schema = JOI.object({
        name: JOI.string().min(3).required(),
        age: JOI.number().min(1).required(),
        hobbies: JOI.array().required()
    })

    const {error} = schema.validate(req.body)

    if (error){
        res.status(400).json({msg: error.details[0].message})
    }
    else{
        let new_person = {
            id: uuid.v4(),
            name: req.body.name,
            age: req.body.age,
            hobbies: req.body.hobbies
        }

        persons.push(new_person)
        res.sendStatus(200)
    }
})

app.put('/person/:id', (req, res) => {
    const idx = persons.findIndex((p) => p.id == req.params.id)

    const schema = JOI.object({
        name: JOI.string().min(3).required(),
        age: JOI.number().min(1).required(),
        hobbies: JOI.array().required(),
    })

    const {error} = schema.validate(req.body)

    if (idx == -1){
        res.status(404).json({msg: `person with id ${req.params.id} not found`})
    }

    else if (error){
        res.status(400).json({msg: error.details[0].message})
    }

    else{

        persons[idx].name = req.body.name
        persons[idx].age = req.body.age
        persons[idx].hobbies = req.body.hobbies

        res.sendStatus(200)
    }

})

app.delete('/person/:id', (req, res) => {
    const idx = persons.findIndex((p) => p.id == req.params.id)
    if (idx == -1){
        res.status(404).json({msg: `person with id ${req.params.id} not found`})
    }
    else{
        persons.splice(idx, 1)
        res.sendStatus(200)
    }

})

// handling non existing routes
app.use((req, res, next) => {
    res.status(404).json({msg: `route ${req.url} not found`})
})

if (require.main === module){
    app.listen(5000, () => {console.log('server has started')})

}

module.exports = app;