import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCustomerComponent } from './manage-customers';

describe('ManageCustomerComponent', () => {
  let component: ManageCustomerComponent;
  let fixture: ComponentFixture<ManageCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCustomerComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCustomerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
