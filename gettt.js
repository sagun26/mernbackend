fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then((response) => response.json())
  .then((json) => console.log(json));

require('dotenv').config();
const add =require('map');
const express =require('express');
const ConnectToDatabase = require('./database/database.js');
const app = express();
const connectionstring="mongodb+srv://sagunsigdel6:1234@cluster0.iblzdzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const ddd =add()
const port =3000;
app.get("/",(req,res)=>{
    res.send("this is a hllo")
})

app.listen(process.env.PORT ,()=>
{
    console.log('nodejs server iss running on port 3000')
})
// app.listen(portnumber,callback)  
//  "portnumber":unknown word