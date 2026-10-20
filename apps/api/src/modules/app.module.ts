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
import * as path from 'path';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { PersonalStorageModule } from './personal-storage/personal-storage.module';
import { APP_GUARD } from '@nestjs/core';
import { TrustedOriginGuard } from '../shared/auth/trusted-origin.guard';

@Module({
  imports: [
    SentryModule.forRoot(),
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../../.env'),
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
      provide: 'APP_FILTER',
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule {}
