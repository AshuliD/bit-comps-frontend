import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeComponent } from './employee.component';
import { MaterialComponentsModule } from '../../../material-component/material.module'; // Adjusted path

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeComponent], // Use declarations for non-standalone components
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MaterialComponentsModule // Import the shared Material module
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This triggers ngOnInit and form initialization
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize employeeForm after ngOnInit', () => {
    expect(component.employeeForm).toBeDefined();
  });

  it('employeeForm should contain all required controls', () => {
    expect(component.employeeForm.contains('name')).toBeTrue();
    expect(component.employeeForm.contains('age')).toBeTrue();
    expect(component.employeeForm.contains('birthDate')).toBeTrue();
    expect(component.employeeForm.contains('salary')).toBeTrue();
    expect(component.employeeForm.contains('phoneNumber')).toBeTrue();
  });

  it('name control should have initial value of empty string', () => {
    const nameControl = component.employeeForm.get('name');
    expect(nameControl?.value).toBe('');
  });

  it('age control should have initial value of null', () => {
    const ageControl = component.employeeForm.get('age');
    expect(ageControl?.value).toBeNull();
  });

  it('birthDate control should have initial value of null', () => {
    const birthDateControl = component.employeeForm.get('birthDate');
    expect(birthDateControl?.value).toBeNull();
  });

  it('salary control should have initial value of null', () => {
    const salaryControl = component.employeeForm.get('salary');
    expect(salaryControl?.value).toBeNull();
  });

  it('phoneNumber control should have initial value of empty string', () => {
    const phoneNumberControl = component.employeeForm.get('phoneNumber');
    expect(phoneNumberControl?.value).toBe('');
  });

  it('name control should have Validators.required', () => {
    const nameControl = component.employeeForm.get('name');
    // Check if the control has the required validator by checking for the 'required' error
    // when the control is invalid and touched/dirty.
    nameControl?.setValue(''); // Make it invalid
    const errors = nameControl?.errors;
    expect(errors?.['required']).toBeTruthy();
  });

  // Example of how to check for a validator more directly if needed,
  // though checking the error is often more practical.
  it('name control should be explicitly marked as required in its definition', () => {
    const nameControl = component.employeeForm.get('name');
    // This is a more direct check of the validator function itself.
    // Create a dummy control with the same validator and check.
    // This is a bit more involved and usually checking the error state is sufficient.
    let hasRequiredValidator = false;
    if (nameControl?.validator) {
      const validator = nameControl.validator({} as any); // Pass a dummy control
      if (validator && validator['required']) {
        hasRequiredValidator = true;
      }
    }
    expect(hasRequiredValidator).toBeTrue();
  });
});
