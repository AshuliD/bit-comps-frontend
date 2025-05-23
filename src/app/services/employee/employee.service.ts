import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { HttpService } from '../http.service'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = environment.baseUrl + '/api/employees'; // Adjusted API URL path

  constructor(
    private http: HttpClient,
    private httpService: HttpService // Injected HttpService
  ) { }

  private getHeaders() {
    let headers = {};
    const authToken = this.httpService.getAuthToken();
    if (authToken !== null) {
      headers = {
        Authorization: 'Bearer ' + authToken,
      };
    }
    return headers;
  }

  getEmployees(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post(this.apiUrl, employee, { headers: this.getHeaders() });
  }

  updateEmployee(id: string | number, employee: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, employee, { headers: this.getHeaders() });
  }

  deleteEmployee(id: string | number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }
}
