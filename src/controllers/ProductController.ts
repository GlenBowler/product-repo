import { FastifyRequest, FastifyReply } from 'fastify'
const db = require("../models");



async function createProduct(
    req: FastifyRequest<{
        Body: {
            name: string
            price: number,
            description: string,
            quantity: number
        }
        Headers: {
            authorization: string
        }
    }>,
    res: FastifyReply) {
    try {
        let { name, price, description, quantity } = req.body ?? {}
        if(!name || !price || !description || !quantity){
            return res.status(500).send({
                status: 500,
                message: "All fields are required"
            })
        }
        if(typeof name !== 'string' || typeof price !== 'number' || typeof description !== 'string' || typeof quantity !== 'number'){
            return res.status(500).send({
                status: 500,
                message: "Invalid data type. Please look at the type you sent and what it should be"
            })
        }

        let findProduct = await db.product.findOne({
            where: {
                name: name,
                isDeleted: false,
                isActive: true
            }
        }).then((x: any) => JSON.parse(JSON.stringify(x)))
        if(findProduct){
            return res.status(500).send({
                status: 500,
                message: "Product already exists"
            })
        }
        else{
            await db.product.create({
                name: name,
                price: price,
                description: description,
                quantity: quantity,
                createdById: req.userId,
                updatedById: req.userId
            })
            return res.status(200).send({
                status: 200,
                message: "Product created successfully"
            })
        }
        
    }
    catch (err: any) {
        console.log(err)
        res.send({
            status: 500,
            message: err
        })
    }
}


export {
    createProduct
}