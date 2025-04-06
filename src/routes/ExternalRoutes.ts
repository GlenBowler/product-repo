import { FastifyInstance } from 'fastify'
import * as TestController from '../controllers/TestingController'
import * as AuthController from '../controllers/AuthController'
import * as ProductController from '../controllers/ProductController'

//Prehandler middleware like next in express
const Authorize = { preHandler: AuthController.authenticateToken }


export default async function (fastify: FastifyInstance) {
  fastify.get('/test', TestController.test)
  fastify.post("/auth/register", AuthController.registerUser)
  fastify.post("/auth/authenticate", AuthController.authenticate)

  fastify.post("/product/create", Authorize, ProductController.createProduct)
}
