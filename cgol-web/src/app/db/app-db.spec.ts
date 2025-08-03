import { TestBed } from '@angular/core/testing';

import { AppDB } from './app-db';

describe('AppDB', () => {
  let service: AppDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
