const express = require("express");
const app = express();
const swaggerDocs = require("./swagger/swagger");
const UserRoute = require("./routes/user.route")
const {connectDb} = require("./config/db")

app.use(express.json());

connectDb()

app.use("/user",UserRoute)
swaggerDocs(app);

app.listen(3000,()=>console.log("servers listening on port 3000"))