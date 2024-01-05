import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environment.baseUrl

  constructor(private httpClient: HttpClient) { }


  getHero(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${ this.baseUrl }/heroes`);
  }
}
