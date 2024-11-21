const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const db_connect = require('./connection/dbConnection')
const cloudinary = require('cloudinary')

const app = express()

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))

app.use(cors({
    origin: [process.env.DASHBOARD_URL, process.env.PORTFOLIO_URL],
    methods: ["GET", "POST", "PUT", "DELETE",],
    credentials: true
}))

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

app.use('/', require('./routes/messageRoutes'))
app.use('/', require('./routes/userRoutes'))
app.use('/', require('./routes/timelineRoutes'))
app.use('/', require('./routes/softwareApplicationRoutes'))
app.use('/', require('./routes/skillRoutes'))
app.use('/', require('./routes/projectRoutes'))


db_connect()

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`))