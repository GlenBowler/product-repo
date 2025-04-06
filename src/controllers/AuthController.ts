import { Op } from "sequelize";
import { FastifyRequest, FastifyReply } from 'fastify'

const bcrypt = require("bcrypt");
const validator = require("validator");
const db = require("../models");
const jwt = require("jsonwebtoken");

// this is thee to pass trough userId to the next middleware so that i can see who updated what and when


async function registerUser(
    req: FastifyRequest<{
        Body: {
            emailAddress: string
            password: string
        }
    }>,
    res: FastifyReply
) {
    try {
        const { emailAddress, password } = req.body

        if (!emailAddress || !password) {
            return res.status(500).send({
                status: 500,
                message: "Both email and password are required"
            })
        }

        if (!validator.isEmail(emailAddress)) {
            return res.status(400).send({
                status: 400,
                message: "Invalid email address"
            })
        }
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).send({
                status: 400,
                message: "Password is not strong enough. Your password need to consist of the following elements: min 8 characters, min 1 lowercase letter, min 1 uppercase letter, min 1 number, min 1 symbol"
            })
        }


        let findUser = await db.user.findOne({
            where: {
                emailAddress: emailAddress,
                isActive: true,
                isDeleted: false
            }
        })

        if (findUser) {
            res.status(400).send({ status: 400, message: "User already exists" })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = await db.user.create({
                emailAddress: emailAddress,
                password: hashedPassword
            })

            return res.status(200).send({
                status: 200,
                mesage: "User registered successfully"
            })
        }

    }
    catch (err: any) {
        console.log(err)
        return res.send(err)
    }
}

async function authenticate(req: FastifyRequest<{
    Body: {
        emailAddress: string
        password: string
    }
}>,
    res: FastifyReply) {
    try {
        let { emailAddress, password } = req.body
        let findUser = await db.user.findOne({
            where: {
                emailAddress: emailAddress,
                isActive: true,
                isDeleted: false
            },
            attributes: ['password','id']
        }).then((x: any) => JSON.parse(JSON.stringify(x)))

        if (findUser) {
            let hashedPassword = await bcrypt.hash(password, 10)
            let compare = await bcrypt.compare(password, hashedPassword)
            if (compare) {
                const token = jwt.sign({
                    emailAddress: emailAddress,
                    password: password,
                    userId: findUser.id
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                )
                const expireTimestamp = Date.now() + 10800000;
                const expireDate = new Date(expireTimestamp);
                return res.send({
                    access_token: token,
                    status: 200,
                    expire: expireDate
                })
            }
            else {
                return res.status(400).send({ status: 400, message: "Invalid credentials" })
            }
        }
    }
    catch (err: any) {
        console.log(err)
    }
}

async function authenticateToken(
    req: FastifyRequest<{
        Headers: {
            authorization: string
        }}>,
    res: FastifyReply) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ status: 401, message: "Unauthorized: Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

       
    } catch (error) {
        return res.status(403).send({ status: 403, message: "Unauthorized: Invalid or expired token" });
    }
}

export {
    registerUser,
    authenticate,
    authenticateToken
}