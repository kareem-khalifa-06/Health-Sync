import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentConfirmDialogComponent } from './appointment-confirm-dialog.component';

describe('AppointmentConfirmDialogComponent', () => {
  let component: AppointmentConfirmDialogComponent;
  let fixture: ComponentFixture<AppointmentConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
