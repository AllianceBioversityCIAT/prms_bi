import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiComponent } from './bi.component';

describe('BiComponent', () => {
  let component: BiComponent;
  let fixture: ComponentFixture<BiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
