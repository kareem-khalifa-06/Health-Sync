import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationssDropdownComponent } from './Notificationss-dropdown.component';

describe('NotificationssDropdownComponent', () => {
  let component: NotificationssDropdownComponent;
  let fixture: ComponentFixture<NotificationssDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationssDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationssDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
