const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.json("response on browser")
})

app.post('/source_system',(req,res)=> {
    axios.post('https://qztywn8ya2.execute-api.us-east-2.amazonaws.com/dev/source_system/read?tasktype=read', req.body)
    .then(response =>{
        console.log("axios response",response)   
        res.json(response.data)
    }).catch(err => console.log("axios error",err))
});

app.listen(8000, ()=> console.log("running on port 8000"))