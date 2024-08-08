import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

const options = {
    swaggerDefinition : {
        openapi : "3.0.0",
        info: {
            version: "1.0.0",
            title: "simple2",
            description : 
                "login and profile system using docker and prisma"
        },
        servers : [
            {
                url: "http://localhost:3000"
            },
        ],
    },
    apis: ["./src/apiRouter.ts", "./src/loginRouter.ts"],
}

const specs = swaggerJSDoc(options)

export default { swaggerUi, specs }