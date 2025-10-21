import express, {Express} from "express"
import path from "path"
import router from "./src/routing/index"
import mongoose ,{Connection} from 'mongoose'
import morgan from "morgan"
import cors ,{CorsOptions,} from "cors"

const app: Express = express()
const port: number = 3001

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3002',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))


const mongoDB: string = "mongodb://127.0.0.1:27017/FullStackDB"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

app.use(express.static(path.join(__dirname, "../public")))
app.use((req, res, next) => {
    express.json()(req, res, next);
});
app.use("/", router)
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})