const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

//-------Mongoose Connect ----------
const db = require('./models');
const Role = db.role;
mongoose
  .connect(
    "mongodb+srv://imodclub:BlackShadow@cluster0.ok1dh.mongodb.net/stock?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
)
  .then(() => {
    console.log("Successfully connect to MongoDB");
    initial();
  })
  .catch((error) => {
    handleError(error)
    process.exit()
  });
mongoose.Promise = global.Promise;


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("Error ", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("Error " , err);
        }
        console.log("added 'moderator' ro roles collection")
      });
       new Role({
         name: "admin",
       }).save((err) => {
         if (err) {
           console.log("Error ", err);
         }
         console.log("added 'admin' to roles collection");
       });
    }
  })
}

//-------Mongoose End-------------

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const users = require("./routers/users");
require('./routers/auth.routes')(app);
require('./routers/user.routes')(app);

app.use("/", users);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server stated on port ${port}`));
