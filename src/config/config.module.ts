import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { AllExceptionsFilter } from './allexceptions.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration], //this is the file where we loaded the objects
            envFilePath: '.env', //In production server use your desired env filename Ex.production.env in place of .env
            isGlobal: true, //If "true", the ConfigModule will registers as a global module in application. can be accessable in any module
        })
    ],
    providers: [
        /* Global exception filter as provider
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        }
        */
    ]
})
export class MyConfigModule { }