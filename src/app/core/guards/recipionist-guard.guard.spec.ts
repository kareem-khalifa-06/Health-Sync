import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { recipionistGuardGuard } from './recipionist-guard.guard';

describe('recipionistGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => recipionistGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
