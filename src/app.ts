import Fastify from 'fastify'
import dotenv from 'dotenv'
import path from "path";

const db= require(path.resolve(__dirname, "./models/index"));
const routes = require(path.resolve(__dirname, "./routes/ExternalRoutes"));


// be used as global req.userId for checking who update and who created
declare module 'fastify' {
    interface FastifyRequest {
      userId?: string
    }
  }
dotenv.config()

const fastify = Fastify({
  logger: false
})

const startServer = async () => {
  try {
    fastify.register(routes)
    await db.sequelize.authenticate()
    await db.sequelize.sync({ alter: true })


    await fastify.listen({ port: parseInt(process.env.PORT || '3000', 10), host: '0.0.0.0' })
    fastify.log.info('Server started on port 3000');
    
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

startServer()
