import express from 'express'
import cors from 'cors'
import nodesRouter from './routes/nodes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/nodes', nodesRouter)

export default app
