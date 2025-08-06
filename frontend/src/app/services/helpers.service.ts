import { Injectable } from '@angular/core';
import { HelperUser } from '../models/helper.model'
import { Observable,of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseHelper } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  constructor(private httpClient : HttpClient) { }
  private url = 'http://localhost:5000/api/helpers';

  getHelpers(sortBy: string='',searchTerm: string='',service: string[]=[], org: string[] = []): Observable<HelperUser[]>{
    return this.httpClient.post<HelperUser[]>(`${this.url}/getAll`,{sortBy,searchTerm,service,org});
  }

  addHelper(helper: FormData): Observable<ResponseHelper>{
    return this.httpClient.post<ResponseHelper>(`${this.url}/add`,helper);
  }

  getCount(): Observable<{count:number}>{
    return this.httpClient.get<{count: number}>(`${this.url}/getCount`);
  }

  updateHelper(id: string,helper: FormData): Observable<{message: string}>{
    return this.httpClient.put<{message: string}>(`${this.url}/update/${id}`,helper);
  }
  getHelperById(id: string): Observable<HelperUser>{
    return this.httpClient.get<HelperUser>(`${this.url}/get/${id}`);
  }

  deleteHelper(id: number): Observable<{message: string}>{
    return this.httpClient.delete<{message: string}>(`${this.url}/delete/${id}`);
  } 

}
