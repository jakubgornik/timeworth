import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule, PrismaService } from '@packages/db';
import { UserModule } from './user/user.module';
import { SupabaseModule } from './supabase/supabase.module';
import { SupabaseService } from './supabase/supabase.service';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { WorkEntryModule } from './work-entry/work-entry.module';
import * as path from 'path';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    SupabaseModule,
    AuthModule,
    OrganizationModule,
    WorkEntryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SupabaseService],
})
export class AppModule {}
