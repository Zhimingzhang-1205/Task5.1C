const express = require("express")
const bodyParse = require("body-parser")
const https = require("https")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const User = require("./models/User.js")
mongoose.connect("mongodb+srv://admin:zhimingzhang@cluster0.bxxpf.mongodb.net/deakin?retryWrites=true&w=majority", { useNewUrlParser: true })
const app = express()

app.use(bodyParse.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/custlogin.html")
})
app.get('/success', (req, res) => {
    res.sendFile(__dirname + "/success.html")
})
app.get('/custlogin', (req, res) => {
    res.sendFile(__dirname + "/custlogin.html")
})
app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/register.html")
})

app.post('/register', (req, res) => {
    const lname = req.body.lastName
    const fname = req.body.firstName
    const city = req.body.city
    const email = req.body.email
    var password = req.body.password
    var cpassword = req.body.ConfirmPassword
    const address = req.body.address
    const address1 = req.body.address2
    const region = req.body.region
    const zip = req.body.zip
    const phone = req.body.phone

    
    const saltRouns =10;
    const salt=bcrypt.genSaltSync(saltRouns);
    var hashpass=bcrypt.hashSync(password,salt);
    password=hashpass;
    var hashcpass=bcrypt.hashSync(cpassword,salt);
    cpassword=hashcpass;
    const user = new User(
        {
            lname: lname,
            fname: fname,
            city: city,
            email: email,
            password: password,
            cpassword: cpassword,
            address: address,
            address1: address1,
            region: region,
            zip: zip,
            phone: phone
        }
    )
    

    user.save((err) => {
        if (err) { console.log(err) 
        req.flash('erron','erro')
        return res.redirect('/register.html')
        }
        else { console.log("Successfull!") }
        res.redirect('/')
    })
    
    const data = {
        members:[{
            email_address: email,
            status : "subscribed",
            merge_fields:{
                FNAME:fname,
                LNAME:lname
            }
        }]
    }
    jsonData = JSON.stringify(data)
    
    const apikey="420e7e94f1749cd77058f9ba2770594e-us5"
    const url= "https://us5.api.mailchimp.com/3.0/lists/29e7bbe168"
    const options={
        method:"POST",
        auth:"azi:420e7e94f1749cd77058f9ba2770594e-us5"
    }


    const request = https.request(url, options , (response)=>{

        response.on("data", (data)=> {
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()

})

app.post('/custlogin', (req, res) => {
    const email = req.body.inputEmail
    var password = req.body.inputPassword

    
    User.find({email:email},function(erro,result){
        for(var i=0;i<result.length;i++){

        
        if (result[i] == null){
            res.flash("no users!")
            console.log(erro)
        }else{
            var temp=result[i].password
            console.log(temp)
            const pwd=bcrypt.compareSync(password,temp)
            console.log(pwd)
            if(pwd){
               console.log("Successfull!")
               res.sendFile(__dirname + "/success.html")
            }else{
                res.flash("password erro!")
     
            }
            
        }
    }
        
        

    })
 

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}

app.listen(port, (req,res)=>{
    console.log("Server is running successfullly!")
})