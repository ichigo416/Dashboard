import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTableComponent } from "./basic-table";



describe('BasicTable', () => {
  let component: BasicTableComponent;
  let fixture: ComponentFixture<BasicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
