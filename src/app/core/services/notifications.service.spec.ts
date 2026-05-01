import { TestBed } from '@angular/core/testing';

import { NotificationssService } from './Notificationss.service';

describe('NotificationssService', () => {
  let service: NotificationssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
