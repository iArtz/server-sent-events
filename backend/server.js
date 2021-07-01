import EventEmitter from 'eventemitter3'
import express from 'express'
import cors from 'cors'

const PORT = 3000
const emitter = new EventEmitter()
const app = express()
const subscribe = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  // After client opens connection send uuid (process Id)
  const processId = Math.floor(Math.random() * 1000 - 1)
  const initSubscribeData = {
    processId,
    startProcessAt: new Date().toLocaleString(),
  }
  console.log(initSubscribeData)

  const onMessage = (data) => {
    console.log(data)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  emitter.on('board', onMessage)
  initData()
  req.on('close', function () {
    emitter.removeListener('board', onMessage)
  })
}

const publish = (req, res) => {
  emitter.emit('board', req.body)
  res.json({ message: 'success' })
}

const initData = () => {
  // Data From Server
  const jobsList = [
    { message: 'ABCD-MS-RY-00001' },
    { message: 'ABCD-MS-RY-00002' },
    { message: 'ABCD-MS-RY-00003' },
    { message: 'ABCD-MS-RY-00004' },
    { message: 'ABCD-MS-RY-00005' },
    { message: 'ABCD-MS-RY-00006' },
    { message: 'ABCD-MS-RY-00007' },
    { message: 'ABCD-MS-RY-00008' },
    { message: 'ABCD-MS-RY-00009' },
    { message: 'ABCD-MS-RY-000010' },
    { message: 'ABCD-MS-CB-00001' },
    { message: 'ABCD-MS-CB-00002' },
    { message: 'ABCD-MS-CB-00003' },
    { message: 'ABCD-MS-CB-00004' },
    { message: 'ABCD-MS-CB-00005' },
    { message: 'ABCD-MS-SB-00001' },
    { message: 'ABCD-MS-SB-00002' },
    { message: 'ABCD-MS-SB-00003' },
    { message: 'ABCD-MS-SB-00004' },
    { message: 'ABCD-MS-SB-00005' },
    { message: 'ABCD-MS-SB-00006' },
    { message: 'ABCD-MS-SB-00007' },
    { message: 'ABCD-MS-SB-00008' },
    { message: 'ABCD-MS-SB-00009' },
    { message: 'ABCD-MS-SB-000010' },
  ]
  jobsList.map((msg) => {
    emitter.emit('board', { message: msg.message })
  })
}

app.use(cors())
app.use(express.json())
app.post('/', publish)
app.get('/', subscribe)
app.listen(PORT || 3000, () => {
  console.log(`listen on port: ${PORT}`)
})
