import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
import { StripeWebhookController } from './stripe-webhook/stripe-webhook.controller';
import { DatabaseModule } from './database/database.module';
import { CompanyModule } from './company/company.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { TaskModule } from './task/task.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { EmailModule } from './email/email.module';
import { DiscountModule } from './discount/discount.module';
import { ProductModule } from './product/product.module';
import { AddonModule } from './addon/addon.module';
import { TableModule } from './table/table.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EncryptionModule } from './encryption/encryption.module';
import { SocketModule } from './socket/socket.module';
import * as Joi from 'joi'; // Please do not convert do default import as this will crash the app
import jsonBodyMiddleware from './common/middleware/json-body.middleware';
import rawBodyMiddleware from './common/middleware/raw-body.middleware';
import { AppGateway } from './app.gateway';
import { FileModule } from './file/file.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Postrgres database variables
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        // Mongo database variables
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        // JWT company access and refresh token variables
        JWT_COMPANY_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_COMPANY_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // JWT user access and refresh token variables
        JWT_USER_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_USER_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // Encryption service used to get to orders
        JWT_ENCRYPTION_TOKEN_SECRET: Joi.string().required(),
        // Stripe env variables
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        STRIPE_CURRENCY: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        STANDARD_SUBSCRIPTION_ID: Joi.string().required(),
        PREMIUM_SUBSCRIPTION_ID: Joi.string().required(),
        // Nodemailer Email variables
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        // AWS S3 Services
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    TaskModule,
    CompanyModule,
    PaymentModule,
    StripeWebhookModule,
    AuthenticationModule,
    SubscriptionModule,
    EmailModule,
    DiscountModule,
    ProductModule,
    AddonModule,
    TableModule,
    UserModule,
    OrderModule,
    DashboardModule,
    EncryptionModule,
    SocketModule,
    AppGateway,
    FileModule,
    AnalyticsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(rawBodyMiddleware())
      .forRoutes(StripeWebhookController)
      .apply(jsonBodyMiddleware())
      .forRoutes('*');
  }
}
