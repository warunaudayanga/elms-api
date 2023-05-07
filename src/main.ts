import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ClassSerializerInterceptor, UnauthorizedException, ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { AllExceptionsFilter } from "./core/filters";
import { LoggerService } from "./core/services";
import configuration from "./core/config/configuration";
import { AuthErrors } from "./modules/auth/responses";

// eslint-disable-next-line func-style
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new LoggerService(),
        bodyParser: false,
    });
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.setGlobalPrefix("api");
    app.use(cookieParser(configuration().cookies.secret));
    app.use(helmet());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || configuration().app.allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new UnauthorizedException(AuthErrors.AUTH_401_CORS));
            }
        },
        credentials: true,
    });
    // app.useStaticAssets(join(__dirname, "..", "public"));
    // app.setBaseViewsDir(join(__dirname, "..", "views"));
    // app.setViewEngine("hbs");
    await app.listen(configuration().app.port);
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
