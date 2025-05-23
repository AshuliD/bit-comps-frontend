import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, Validators, NgForm } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeComponent } from './employee.component';
import { MaterialComponentsModule } from '../../../material-component/material.module';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { of, throwError } from 'rxjs';

// Mock EmployeeService
class MockEmployeeService {
  getEmployees = jasmine.createSpy('getEmployees').and.returnValue(of([]));
  addEmployee = jasmine.createSpy('addEmployee').and.returnValue(of({ id: '1', name: 'New Employee' }));
  updateEmployee = jasmine.createSpy('updateEmployee').and.returnValue(of({ id: '1', name: 'Updated Employee' }));
  deleteEmployee = jasmine.createSpy('deleteEmployee').and.returnValue(of({}));
}

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let mockEmployeeService: MockEmployeeService;
  let mockMessageService: jasmine.SpyObj<MessageServiceService>;

  const mockEmployees = [
    { id: '1', name: 'John Doe', age: 30, birthDate: new Date(), salary: 50000, phoneNumber: '1234567890' },
    { id: '2', name: 'Jane Smith', age: 25, birthDate: new Date(), salary: 60000, phoneNumber: '0987654321' }
  ];

  beforeEach(async () => {
    mockMessageService = jasmine.createSpyObj('MessageServiceService', ['showSuccess', 'showError', 'showWarining']); // Added showWarining
    mockEmployeeService = new MockEmployeeService();

    await TestBed.configureTestingModule({
      declarations: [EmployeeComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MaterialComponentsModule
      ],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: MessageServiceService, useValue: mockMessageService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    // Manually set the formDirective mock if needed, or ensure it's handled if template interaction is tested
    // For most service interaction tests, formDirective might not be directly involved in assertions
    component.formDirective = { resetForm: jasmine.createSpy('resetForm') } as unknown as NgForm;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization and Validation', () => {
    it('should initialize employeeForm after ngOnInit', () => {
      expect(component.employeeForm).toBeDefined();
    });

    it('employeeForm should contain all required controls', () => {
      expect(component.employeeForm.contains('id')).toBeTrue();
      expect(component.employeeForm.contains('name')).toBeTrue();
      expect(component.employeeForm.contains('age')).toBeTrue();
      expect(component.employeeForm.contains('birthDate')).toBeTrue();
      expect(component.employeeForm.contains('salary')).toBeTrue();
      expect(component.employeeForm.contains('phoneNumber')).toBeTrue();
    });

    it('name control should have Validators.required', () => {
      const nameControl = component.employeeForm.get('name');
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBeTrue();
    });
  });

  describe('loadEmployees', () => {
    it('should call employeeService.getEmployees on init', () => {
      expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
    });

    it('should populate dataSource on successful getEmployees', () => {
      mockEmployeeService.getEmployees.and.returnValue(of(mockEmployees));
      component.loadEmployees(); // Call directly to test this unit
      expect(component.dataSource.data).toEqual(mockEmployees);
    });

    it('should call messageService.showError on getEmployees error', () => {
      mockEmployeeService.getEmployees.and.returnValue(throwError(() => new Error('Failed to load')));
      component.loadEmployees();
      expect(mockMessageService.showError).toHaveBeenCalledWith('Failed to load employees.');
    });
  });

  describe('onSubmit - Add Mode', () => {
    beforeEach(() => {
      component.mode = 'Save';
      component.employeeForm.setValue({
        id: null, name: 'New Guy', age: 28, birthDate: new Date(), salary: 55000, phoneNumber: '1112223333'
      });
    });

    it('should call employeeService.addEmployee with form data (excluding id)', () => {
      const { id, ...expectedPayload } = component.employeeForm.value;
      mockEmployeeService.addEmployee.and.returnValue(of({ id: '3', ...expectedPayload }));
      component.onSubmit();
      expect(mockEmployeeService.addEmployee).toHaveBeenCalledWith(expectedPayload);
    });

    it('should call loadEmployees, messageService.showSuccess and resetForm on successful add', () => {
      spyOn(component, 'loadEmployees'); // Spy on component's own method
      spyOn(component, 'resetForm');    // Spy on component's own method
      component.onSubmit();
      expect(mockMessageService.showSuccess).toHaveBeenCalledWith('Employee added successfully!');
      expect(component.loadEmployees).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
    });

    it('should call messageService.showError on addEmployee error', () => {
      mockEmployeeService.addEmployee.and.returnValue(throwError(() => new Error('Failed to add')));
      component.onSubmit();
      expect(mockMessageService.showError).toHaveBeenCalledWith('Failed to add employee.');
    });

    it('should call messageService.showError if form is invalid and not submit', () => {
        component.employeeForm.get('name')?.setValue(''); // Make form invalid
        component.onSubmit();
        expect(mockMessageService.showError).toHaveBeenCalledWith('Please fill all required fields correctly.');
        expect(mockEmployeeService.addEmployee).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit - Edit Mode', () => {
    const existingEmployee = { id: '1', name: 'Old Name', age: 40, birthDate: new Date(), salary: 70000, phoneNumber: '5555555555' };
    beforeEach(() => {
      component.mode = 'Edit';
      component.selectedData = existingEmployee; // Set selectedData for edit
      component.employeeForm.setValue(existingEmployee); // Populate form
    });

    it('should call employeeService.updateEmployee with id and form data', () => {
      mockEmployeeService.updateEmployee.and.returnValue(of({ ...existingEmployee, name: 'Updated Name' }));
      component.onSubmit();
      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(existingEmployee.id, component.employeeForm.value);
    });

    it('should call loadEmployees, messageService.showSuccess and resetForm on successful update', () => {
      spyOn(component, 'loadEmployees');
      spyOn(component, 'resetForm');
      component.onSubmit();
      expect(mockMessageService.showSuccess).toHaveBeenCalledWith('Employee updated successfully!');
      expect(component.loadEmployees).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
    });

    it('should call messageService.showError on updateEmployee error', () => {
      mockEmployeeService.updateEmployee.and.returnValue(throwError(() => new Error('Failed to update')));
      component.onSubmit();
      expect(mockMessageService.showError).toHaveBeenCalledWith('Failed to update employee.');
    });
  });

  describe('editData', () => {
    it('should set mode to Edit, update saveBtnLabel, and patch form values', () => {
      component.editData(mockEmployees[0]);
      expect(component.mode).toBe('Edit');
      expect(component.saveBtnLabel).toBe('Update Employee');
      expect(component.selectedData).toEqual(mockEmployees[0]);
      expect(component.employeeForm.value).toEqual(mockEmployees[0]); // Form includes id
    });
  });

  describe('deleteData', () => {
    const employeeIdToDelete = '1';
    beforeEach(() => {
        // Reset spies for each test if they might be called multiple times across tests in this describe block
        mockEmployeeService.deleteEmployee.calls.reset();
        mockMessageService.showSuccess.calls.reset();
        mockMessageService.showError.calls.reset();
        spyOn(component, 'loadEmployees').and.callThrough(); // Spy on loadEmployees to ensure it's called
        spyOn(component, 'resetForm').and.callThrough(); // Spy on resetForm
    });

    it('should call employeeService.deleteEmployee with the correct id', () => {
      component.deleteData(employeeIdToDelete);
      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(employeeIdToDelete);
    });

    it('should call loadEmployees and messageService.showSuccess on successful delete', () => {
      component.deleteData(employeeIdToDelete);
      expect(component.loadEmployees).toHaveBeenCalled();
      expect(mockMessageService.showSuccess).toHaveBeenCalledWith('Employee deleted successfully!');
    });

    it('should call resetForm if the deleted item was being edited', () => {
      component.selectedData = { id: employeeIdToDelete }; // Simulate this item was in edit mode
      component.deleteData(employeeIdToDelete);
      expect(component.resetForm).toHaveBeenCalled();
    });

    it('should not call resetForm if a different item was being edited', () => {
      component.selectedData = { id: '2' }; // Simulate a different item was in edit mode
      component.deleteData(employeeIdToDelete);
      expect(component.resetForm).not.toHaveBeenCalled();
    });
    
    it('should call messageService.showError on deleteEmployee error', () => {
      mockEmployeeService.deleteEmployee.and.returnValue(throwError(() => new Error('Failed to delete')));
      component.deleteData(employeeIdToDelete);
      expect(mockMessageService.showError).toHaveBeenCalledWith('Failed to delete employee.');
    });

    it('should call messageService.showError if no employeeId is provided', () => {
        component.deleteData(''); // or null, or undefined
        expect(mockMessageService.showError).toHaveBeenCalledWith('Cannot delete employee without an ID.');
        expect(mockEmployeeService.deleteEmployee).not.toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should reset the form, mode, saveBtnLabel, and selectedData', () => {
        // Setup some state to ensure it gets reset
        component.mode = 'Edit';
        component.saveBtnLabel = 'Update Employee';
        component.selectedData = mockEmployees[0];
        component.employeeForm.patchValue(mockEmployees[0]);

        component.resetForm();

        expect(component.formDirective.resetForm).toHaveBeenCalled(); // Check if the mock NgForm's resetForm was called
        expect(component.employeeForm.value).toEqual({ // Check actual form values after reset
            name: '', age: null, birthDate: null, salary: null, phoneNumber: null, id: null
        });
        expect(component.mode).toBe('Save');
        expect(component.saveBtnLabel).toBe('Save Employee');
        expect(component.selectedData).toBeNull();
    });
  });

});
