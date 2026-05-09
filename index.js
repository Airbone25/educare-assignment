require("dotenv").config()
const express = require("express")
const { initializeDatabase } = require("./config/db")
const schoolRoutes = require("./routes/schoolapi")

const app = express()

initializeDatabase()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/",schoolRoutes)

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})