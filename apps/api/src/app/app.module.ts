import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Use environment variable for MongoDB connection
    MongooseModule.forRoot(
      process.env['MONGODB_URI'] ||
      'mongodb+srv://rawan:penny-db123@penny-db.rwe3jvs.mongodb.net/?retryWrites=true&w=majority&appName=penny-db'
    ),

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
