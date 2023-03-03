import { AppModule } from './app/app.module'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import 'dotenv/config'
import { useContainer } from 'class-validator'

const start = async () => {
  try {
    const PORT = process.env.PORT
    const app = await NestFactory.create(AppModule, {
      cors: true
    })

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true,
        validationError: {
          target: true,
          value: true
        }
      })
    )
    useContainer(app.select(AppModule), { fallbackOnErrors: true })
    await app.listen(PORT, () => console.log(`running on ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
