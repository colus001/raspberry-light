const { app } = require('./src/app')

const port = process.env.PORT || 6688
const env = process.env.NODE_ENV || 'development'

app.listen(port, () => {
  console.log(`Node.js api server listening from ${port} in ${env}`)
})
