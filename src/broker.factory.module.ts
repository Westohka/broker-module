import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import BrokerClient from './broker.client';
import { BrokerModuleOptions } from './broker.client';

@Global()
@Module({})
export default class BrokerFactoryModule
  implements OnModuleInit, OnModuleDestroy
{
  @Inject(ModuleRef) private _moduleRef: ModuleRef;

  static forRoot(options: BrokerModuleOptions): DynamicModule {
    return {
      global: true,
      providers: [
        {
          provide: 'BROKER_CONFIG',
          useValue: options,
        },
        BrokerClient,
      ],
      module: BrokerFactoryModule,
      exports: [BrokerClient],
    };
  }

  async onModuleInit() {
    const client = this._moduleRef.get(BrokerClient);

    const container = this._moduleRef['container'];
    const modules = container.getModules();

    for (const module of modules) {
      for (const controller of module[1].controllers) {
        const instance = controller[0]['prototype'];
        const methods = Object.getOwnPropertyNames(controller[0]['prototype']);

        for (const method of methods) {
          const metadata = Reflect.getOwnMetadata(
            'QUEUE_METADATA',
            instance[method],
          );

          if (!metadata) {
            continue;
          }

          await client.subscribe(metadata, instance[method]);
        }
      }
    }
  }

  async onModuleDestroy() {
    const client = this._moduleRef.get(BrokerClient);
    await client.close();
  }
}
