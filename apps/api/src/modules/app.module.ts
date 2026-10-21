import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@packages/db';
import { UserModule } from './user/user.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { WorkEntryModule } from './work-entry/work-entry.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { PersonalStorageModule } from './personal-storage/personal-storage.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TrustedOriginGuard } from '../shared/auth/trusted-origin.guard';
import {
  ROOT_ENV_PATH,
  validateEnvironment,
} from '../shared/config/environment';
import { ApiExceptionFilter } from '../shared/diagnostics/api-exception.filter';

@Module({
  imports: [
    SentryModule.forRoot(),
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ROOT_ENV_PATH,
      validate: validateEnvironment,
    }),
    SupabaseModule,
    AuthModule,
    OrganizationModule,
    WorkEntryModule,
    PersonalStorageModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: TrustedOriginGuard },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
