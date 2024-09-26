import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { tap } from "rxjs";
import { AppRepositoryTag } from './app.repository';
import { AppRepositoryRedis } from './app.repository.redis';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: AppRepositoryTag, useClass: AppRepositoryRedis },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('shorten', () => {
    it('should return a valid string', done => {
      const url = 'aerabi.com';
      appController
        .shorten(url)
        .pipe(tap(hash => expect(hash).toBeTruthy()))
        .subscribe({ complete: done });
    })
  });
});
