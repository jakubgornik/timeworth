import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '@packages/db';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule, PrismaModule], // make sure both are imported
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
