"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app/app.module");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
require("dotenv/config");
const start = async () => {
    try {
        const PORT = process.env.PORT;
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.useGlobalPipes(new common_1.ValidationPipe({
            forbidNonWhitelisted: true,
            whitelist: true,
            transform: true,
            validationError: {
                target: true,
                value: true,
            },
        }));
        await app.listen(PORT, () => console.log(`running on ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
//# sourceMappingURL=main.js.map