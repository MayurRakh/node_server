const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());

let uri = "mongodb+srv://mukesh-10:mukesh-10@cluster0.6uqlv.mongodb.net/?retryWrites=true&w=majority";
let client = null;
let loginDb = null,products = null;

async function main() {
    client = new MongoClient(uri);
    try {

        await client.connect();
        loginDb  = await client.db("redux_middleware").collection("login_details");
        products = await client.db("redux_middleware").collection("products");
        console.log("successfully connect to mongo cluster");

    } catch (e) {
        console.error(e);
    } finally {

    }
}
main().catch(console.error);

app.get('/',(req,res,next) => {
	res.send('Hello Mukesh ....... from Node Js using Nodemon');
});

//save
app.post("/insert", (req, res) => {
    console.log("Server :: insert ",req.body);
    loginDb.insertOne({
        "username" :req.body.username,
        "email": req.body.email,
        "password": req.body.password
    })
        .then(item => {
            res.send(item);
        })
        .catch(err => {
            res.send(err);
        });
});


//validate login credintials
app.post("/loginValidate", (req, res) => {
  console.log("In validateLogin Node JS email ",req.body.username+" "+req.body.password);
  loginDb.find({
    "username": req.body.username,
    "password": req.body.password
  })
    .toArray()
    .then((array) => {
      console.log("Server Response  ",array);
      if (array.length > 0) {
        res.send(array);
      } else {
        res.send(array);
      }
    })
});


//put
app.put("/update/:id", (req, res) => {
    console.log("In update cf Request ", req.params.id, req.body); //<----Here
    loginDb.updateOne({ _id: new ObjectId(req.params.id) }, {
        $set: {
            "name": req.body.name,
            "class": req.body.class
        }
    })
        .then(item => {
            res.send(item);
        })
        .catch(err => {
            res.send(err);
        });

});
//delete

app.delete("/delete/:name", (req, res) => {
    console.log("In Delete Request ", req.params.name); //<----Here
    // collection.deleteOne({ _id: new ObjectId(req.params.name) })
    loginDb.deleteOne({ name: (req.params.name) })
        .then(item => {
            res.send(item);
        })
        .catch(err => {
            res.send(err);
        });
});

//get product list
app.get("/products", (req, res) => {
    products.find().toArray()
        .then(result => {
            res.send(result);
        })
});




app.listen(6001, () => {
    console.log("Server listening port no 6001 :  http://localhost:6001/update ");
})
