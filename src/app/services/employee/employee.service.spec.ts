import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { HttpService } from '../http.service'; // Import HttpService
import { environment } from 'src/app/environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  let httpServiceMock: Partial<HttpService>; // Use Partial for HttpService mock

  const mockApiUrl = environment.baseUrl + '/api/employees';
  const mockEmployee = { name: 'Test Employee', age: 30 };
  const mockEmployeeWithId = { id: '1', name: 'Test Employee', age: 30 };
  const mockEmployeeId = '1';

  beforeEach(() => {
    // Mock HttpService
    httpServiceMock = {
      getAuthToken: jasmine.createSpy('getAuthToken').and.returnValue(null) // Default to no token, spy on it
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeService,
        { provide: HttpService, useValue: httpServiceMock } // Provide the mock
      ]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmployees', () => {
    it('should send a GET request to the correct URL and not include Authorization header if no token', () => {
      service.getEmployees().subscribe();
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush([]); // Respond with mock data
    });

    it('should include Authorization header if token exists', () => {
      (httpServiceMock.getAuthToken as jasmine.Spy).and.returnValue('test-token');
      service.getEmployees().subscribe();
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush([]);
    });
  });

  describe('addEmployee', () => {
    it('should send a POST request to the correct URL with employee data and no Auth header if no token', () => {
      service.addEmployee(mockEmployee).subscribe();
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEmployee);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockEmployeeWithId); // Respond with mock data (employee with ID)
    });

    it('should include Authorization header if token exists for addEmployee', () => {
      (httpServiceMock.getAuthToken as jasmine.Spy).and.returnValue('test-token');
      service.addEmployee(mockEmployee).subscribe();
      const req = httpMock.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEmployee);
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockEmployeeWithId);
    });
  });

  describe('updateEmployee', () => {
    it('should send a PUT request to the correct URL with employee data and no Auth header if no token', () => {
      service.updateEmployee(mockEmployeeId, mockEmployee).subscribe();
      const req = httpMock.expectOne(`${mockApiUrl}/${mockEmployeeId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockEmployee);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush(mockEmployeeWithId); // Respond with updated employee data
    });

    it('should include Authorization header if token exists for updateEmployee', () => {
      (httpServiceMock.getAuthToken as jasmine.Spy).and.returnValue('test-token');
      service.updateEmployee(mockEmployeeId, mockEmployee).subscribe();
      const req = httpMock.expectOne(`${mockApiUrl}/${mockEmployeeId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockEmployee);
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockEmployeeWithId);
    });
  });

  describe('deleteEmployee', () => {
    it('should send a DELETE request to the correct URL and no Auth header if no token', () => {
      service.deleteEmployee(mockEmployeeId).subscribe();
      const req = httpMock.expectOne(`${mockApiUrl}/${mockEmployeeId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({}); // Respond with empty object or success status
    });

    it('should include Authorization header if token exists for deleteEmployee', () => {
      (httpServiceMock.getAuthToken as jasmine.Spy).and.returnValue('test-token');
      service.deleteEmployee(mockEmployeeId).subscribe();
      const req = httpMock.expectOne(`${mockApiUrl}/${mockEmployeeId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush({});
    });
  });
});
