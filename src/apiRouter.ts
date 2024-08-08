import express, {Request, Response, Router} from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
//import { PrismaClient } from '@prisma/client'
//const prisma = new PrismaClient()
import mongoose from 'mongoose'
import users from '../mongo/products'
import dotenv from 'dotenv'

dotenv.config()

mongoose
    .connect(
        process.env.DATABASE_URL as string
    ).then(()=> {
        console.log("Connected to Database")
    }).catch(()=> {
        console.log("Connection fail")
    })

const router: Router = express.Router()
/**
 * @swagger
 * tags: 
 *  name : get User Data
 *  description : 유저 이름, 아이디, 프로필 이미지
 */


/**
 * @swagger
 * paths:
 *   /api/getUserData:
 *     post:
 *       summary: "유저 아이디 및 이름 조회"
 *       description: "서버에 { token : token } 형태의 json을 body에 담아 보내주세요"
 *       tags: [Users]
 *       parameters:
 *         - name : token
 *           in: body
 *           description: body에 토큰을 담아주세요
 *           required: true
 *           schema:
 *              type: object
 *              required:
 *                 - token
 *              properties:
 *                  token: string
 *              example:
 *                  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW1wbGUyIiwiaWF0IjoxNzIyOTI2NzQ0LCJleHAiOjE3NTQ0NjI3NDQsImF1ZCI6ImxvY2FsaG9zdDo4MDgwIiwic3ViIjoiIiwidXNlcm5hbWUiOiJVc2VyMSIsImlkIjoiMSJ9.tqzU2YAniqCxgbWylBvAS9NK4TEqsbmLg41Rf0V2FNM"
 *       responses:
 *         "200":
 *           description: " token에 있는 정보와 password가 전달됩니다"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type : string
 *                     example: "66b23717fa575288466b9bec"
 *                   username:
 *                     type : string
 *                     example: "test"
 *                   password:
 *                      type : string
 *                      example : "1234"
 *                   profile:
 *                      type : string
 *                      example: "eee76b741c47fde514eb9e081589f22d"
 *         "401":
 *           description: "유효하지 않은 토큰의 경우 발생합니다."
 */
router.post('/getUserData', async (req: Request, res: Response) => {
    const {token} = req.body

    try {
        let tokenData = jwt.verify(token, process.env.SECRET_KEY as string) as {username : string}
        const username = tokenData.username;

        users.findOne({username}).then((docs) => {
            return res.json({
                data : {
                    id : docs?._id,
                    username : docs?.username,
                    password : docs?.password,
                    profile : docs?.profile,
                }
            })
        })
        
    } catch (error) {
        return res.status(401).send("Invalid token")
    }
})
/**
 * @swagger
 * paths:
 *  /api/getUserProfile:
 *    post:
 *      summary: "유저 프로필 이미지"
 *      description : "서버에 { token : token } 형태의 json을 body에 담아 보내주세요"
 *      tags : [Users]
 *      parameters:
 *          - name: token
 *            in: body
 *            description: "body에 토큰을 담아주세요"
 *            required: true
 *            schema: 
 *              type: object
 *              required: 
 *                  - token
 *              properties:
 *                  token: 
 *                     type: string
 *              example:
 *                token:  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW1wbGUyIiwiaWF0IjoxNzIyOTI2NzQ0LCJleHAiOjE3NTQ0NjI3NDQsImF1ZCI6ImxvY2FsaG9zdDo4MDgwIiwic3ViIjoiIiwidXNlcm5hbWUiOiJVc2VyMSIsImlkIjoiMSJ9.tqzU2YAniqCxgbWylBvAS9NK4TEqsbmLg41Rf0V2FNM"
 *      responses:
 *          "200":
 *             description : "유저 이미지 파일을 res.sendFile로 응답합니다.
 *                               Blob에 실제 이미지 정보가 담깁니다."
 *             content:
 *                application/octet-stream:
 *                  schema: 
 *                    type: object
 *                    properties:
 *                      size:
 *                        type: integer
 *                        example : 1055859
 *                      type:
 *                        type: string
 *                        example: "application/octet-stream"
 *                      Blob:
 *                        type: object
 *                    
 *                    
 *          "401":
 *             description : "토큰이 유효하지 않을 경우"
 */
router.post("/getUserProfile", async (req: Request, res: Response) => {
    const {token} = req.body

    try {
        let tokenData = jwt.verify(token, process.env.SECRET_KEY as string) as {username : string, profile: string}
        let filePath = path.join(__dirname, "imgs", tokenData.profile)
        return res.sendFile(filePath)
    } catch (error) {
        return res.status(401).send("Invalid token")
    }

})

export default router