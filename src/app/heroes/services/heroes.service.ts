import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { Hero } from "../interfaces/hero.interface";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class HeroesService {
  private baseUrl: string = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getHero(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.httpClient
      .get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(catchError(error => of(undefined, error)));
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(
      `${this.baseUrl}/heroes?q=${query}&_limit=6`
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error("Hero id is required");

    return this.httpClient.patch<Hero>(
      `${this.baseUrl}/heroes/${hero.id}`,
      hero
    );
  }

  deleteHeroById(hero: Hero): Observable<boolean> {
    if (!hero.id) throw Error("Hero id is required");

    return this.httpClient
      .delete(`${this.baseUrl}/heroes/${hero.id}`)
      .pipe(catchError(err => of(false)), map(resp => true));
  }
}
