import { ComponentFixture, TestBed } from '@angular/core/testing';

import { receptionistLayoutComponent } from './receptionist-layout.component';

describe('receptionistLayoutComponent', () => {
  let component: receptionistLayoutComponent;
  let fixture: ComponentFixture<receptionistLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [receptionistLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(receptionistLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
