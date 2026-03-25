import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipsionistLayoutComponent } from './recipsionist-layout.component';

describe('RecipsionistLayoutComponent', () => {
  let component: RecipsionistLayoutComponent;
  let fixture: ComponentFixture<RecipsionistLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipsionistLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipsionistLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
