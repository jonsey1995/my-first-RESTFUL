const Joi = require('joi');
const express = require('express');
const app = express();//creates the express app

app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
];


//global request validation function 
function validateCourse(course) {
    //Validate put request
    const schema = {
        name: Joi.string().min(3).required()
    };
    //compare schema variable to req.body
    return Joi.validate(course, schema);

}

app.get('/', (req, res) => {
    res.send('Welcome to my course catalogue')
});

app.get('/api/courses', (req, res)=> {
    res.send(JSON.stringify(courses))
});

//add to course collection
app.post('/api/courses', (req, res) => {
    // post validation using joi module
    const result = validateCourse(req.body);
    //if req.body.name = another course name, err
    const existingObject = courses.filter( obj =>{
        return obj.name === req.body.name;
    })
    if(req.body.name === existingObject.name) {
        res.status(400).send(result.error.details[0].message)
         console.log(result.error.details[0].message)
        return;

    }

    if (result.error) {
            res.status(400).send(result.error.details[0].message)
            console.log(result.error.details[0].message)
            return;
        }
    //create new course obj
    const newCourse = {
        id: courses.length + 1,
        name: req.body.name
    }

    
    courses.push(newCourse);
    res.send(newCourse);


});

app.put('/api/courses/:id', (req, res)=>{
    //step 1 - look up the course
    function findID(c) {
        return c.id === parseInt(req.params.id);
    }
    const course = courses.find(findID);
    //If non-existent return 404 error
    if(!course) {
        res.status(404).send(`Sorry, the course with id ${req.params.id} was not found`)
    }
    //Validate put request
    const result = validateCourse(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        console.log(result.error.details[0].message)
        return;
    }
    //update course object

    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) =>{
    //LOOK UP COURSE
    function findID(c) {
        return c.id === parseInt(req.params.id);
    }
    const course = courses.find(findID);
    //If non-existent, return 404
    if(!course) {
        res.status(404).send(`Sorry, the course with id ${req.params.id} was not found`)
    }
    //DELETE, first find index of course in courses array 
    const index = courses.indexOf(course);
    //splice object at index from courses array
    courses.splice(index, 1);
    //return deleted course

    res.send(course);

});

app.get('/api/courses/:id', (req, res) => {
    //find in courses array the id that match req.params.id
    //since req.params.int is a string it needs to be passed as an integer to be equated to the key id 
    function findID(c) {
        return c.id === parseInt(req.params.id);
    }
    const course = courses.find(findID);
    
    if(!course) {
        res.status(404).send(`Sorry, the course with id ${req.params.id} was not found`)
    }
    res.send(course);
});
//instead of making if statements for different http requests, 
//each separate url has it's own app.get method providing modularity
//e.g all urls under courses could be placed in a separate js file
const port = process.env.PORT;
//in real world node apps the listening port is dynamically assigned by the hosting environment
app.listen(port, () => console.log(`listening on port ${port}`));
