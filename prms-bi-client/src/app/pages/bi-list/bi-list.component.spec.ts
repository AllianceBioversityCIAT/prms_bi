import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiListComponent } from './bi-list.component';

describe('BiListComponent', () => {
  let component: BiListComponent;
  let fixture: ComponentFixture<BiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
