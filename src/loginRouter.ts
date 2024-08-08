import express, {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
import multer from 'multer'
import dotenv from 'dotenv'
//import {PrismaClient} from '@prisma/client'
//const prisma = new PrismaClient()

import mongoose from 'mongoose'
import users from '../mongo/products'

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

const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, done) {
            done(null, path.join(__dirname, "imgs"))
        },
    })
})

router.get("/", (req : Request, res : Response) => {
    const filePath = path.join(__dirname, "login.html");
    return res.sendFile(filePath)
})
/**
 * @swagger
 * paths:
 *   /login/loginProc:
 *      post:
 *          summary: "access Token 발급"
 *          description : "서버에 { username, password } 형태의 json을 body에 담아 보내주세요"
 *          tags : [Users]
 *          parameters:
 *              - name: data
 *                in : body
 *                description : "body에 json을 담아주세요"
 *                required: true
 *                schema:
 *                  type: object
 *                  required:
 *                      - username
 *                      - password
 *                  properties:
 *                      username:
 *                          type: string
 *                          example: "1234"
 *                      password:
 *                          type: string
 *                          example: "1234"
 *          responses:
 *              "200":
 *                  description : "항상 200을 응답합니다, 데이터 내부에 result의 값을 확인해주세요"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required:
 *                                  - result
 *                              properties:
 *                                  result:
 *                                      type: string
 *                                      example: "success / UserNotExist"
 *                                  token:
 *                                      type: string
 *                                      example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW1wbGUyIiwiaWF0IjoxNzIyOTI2NzQ0LCJleHAiOjE3NTQ0NjI3NDQsImF1ZCI6ImxvY2FsaG9zdDo4MDgwIiwic3ViIjoiIiwidXNlcm5hbWUiOiJVc2VyMSIsImlkIjoiMSJ9.tqzU2YAniqCxgbWylBvAS9NK4TEqsbmLg41Rf0V2FNM"
 *                                  
 * 
 */
router.post("/loginProc", async (req : Request, res : Response) => {
    const {username, password} = req.body
    console.log(username, password)

    users.findOne({$and : [{username}, {password}]}).then((docs)=>{
      console.log(docs)
      if(docs){
        let payload = {
            Id : docs._id,
            username : docs.username,
            profile : docs.profile
        }
        return res.status(200).json({
                data : {
                    "result" : "success",
                    "token" : jwt.sign(payload, process.env.SECRET_KEY as string ,{
                        algorithm : "HS256",
                        expiresIn : '1h'
                    })
                }
          })
        }else{
            return res.status(200).json({
                data: {
                    "result" : "UserNotExist"
                }
            }) 
        }
    })
})

router.get('/regist', (req : Request, res : Response) => {
    const filePath = path.join(__dirname, "regist.html")
    return res.sendFile(filePath)
})

/**
 * @swagger
 * paths:
 *  /login/registProc:
 *     post:
 *          summary: "유저 등록 API"
 *          description: "서버에 {username, password, imageData} 형태의 json을 body에 담아 보내주세요"
 *          tags: [Users]
 *          parameters:
 *              - name: data
 *                in : body
 *                required: true
 *                description: "body에 json을 담아주세요"
 *                schema:
 *                  type: object
 *                  required:
 *                      - username 
 *                      - password
 *                      - profile
 *                  properties:
 *                      username:
 *                          type: string
 *                          example: "test"
 *                      password:
 *                          type: string
 *                          example: "1234"
 *                      profile:
 *                          type: object
 *                          example: "이미지 파일을 넣어주세요"
 *          responses:
 *              "200":
 *                  description: "result에 성공/실패 여부가 담깁니다."
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  result:
 *                                      type: string
 *                                      example: "success / fail"
 *                      
 */
router.post('/registProc' ,upload.single("profile"), async (req : Request, res : Response) => {

    const {username, password} = req.body
    try {
        const createProduct = new users({
            username,
            password,
            profile : req.file?.filename
        })

        await createProduct.save()
        res.json({
            result : "success"
        })
    } catch (error) {
        res.json({
            result : "fail"
        })
    }
})

export default router