import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata";
import { ConfigurationManager } from "../../src/config/configuration.manager";
import { EHRDbConnector } from '../../src.bg.worker/src.bg/modules/ehr.analytics/ehr.db.connector';
import { AwardsFactsDBConnector } from '../src.bg/modules/awards.facts/awards.facts.db.connector';
import { Loader } from '../../src/startup/loader';
import { Injector } from '../../src/startup/injector';
import { AwardsFactsService } from '../src.bg/modules/awards.facts/awards.facts.service';
import { initializeBackgroundRabbitMQ } from '../src.bg/rabbitmq/rabbitmq.connection'
import { Router } from '../../src/api/router';
import { Helper } from '../../src/common/helper';
import { Logger } from '../../src/common/logger';
import { PrimaryDatabaseConnector } from '../../src/database/database.connector';
import { DatabaseClient } from '../../src/common/database.utils/dialect.clients/database.client';
import { DatabaseSchemaType } from '../../src/common/database.utils/database.config';

///////////////////////////////////////////////////////////////////////// 

export default class MainApplication {

    public _app: express.Application;

    private static _instance: MainApplication;

    private constructor() {
        this._app = express();
    }

    public static instance(): MainApplication {
        return this._instance || (this._instance = new this());
    }

    public app(): express.Application {
        return this._app;
    }

    public start = async (): Promise<void> => {

        //Load configurations
        ConfigurationManager.loadConfigurations();

        //Load the modules
        await Loader.init();

        //Connect databases
        await connectDatabase_Primary();

        if (ConfigurationManager.EHRAnalyticsEnabled()) {
            await connectDatabase_EHRInsights();
        }

        if (ConfigurationManager.GamificationEnabled()) {
            await connectDatabase_AwardsFacts();
        }

        // RabbitMQ connection
        await initializeBackgroundRabbitMQ()

        //Start listening
        await this.listen();

    };

    private listen = () => {
        return new Promise((resolve, reject) => {
            try {
                const port = process.env.PORT_BG;
                this._app.listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                    resolve(this._app);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
async function connectDatabase_Primary() {
    if (process.env.NODE_ENV === 'test') {
        const databaseClient = Injector.Container.resolve(DatabaseClient);
        await databaseClient.dropDb(DatabaseSchemaType.Primary);
    }
    const primaryDatabaseConnector = Injector.Container.resolve(PrimaryDatabaseConnector);
    await primaryDatabaseConnector.init();
}

async function connectDatabase_EHRInsights() {
    //Connect with EHR insights database
    await EHRDbConnector.connect();
}

async function connectDatabase_AwardsFacts() {
    //Connect with Awards facts database
    await AwardsFactsDBConnector.connect();
    //Fetch the event types from awards service
    await AwardsFactsService.initialize();
}