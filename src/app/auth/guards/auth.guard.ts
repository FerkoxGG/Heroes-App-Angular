import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanMatch,
  Route,
  UrlSegment,
  UrlTree,
  Router
} from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate, CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap(isAutenticated => {
        if (!isAutenticated) {
          this.router.navigate(["./auth/login"]);
        }
      })
    );
  }

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuthenticated = this.authService.checkAuthentication();

    if (!isAuthenticated) {
      this.router.navigate(["/login"]);
    }
    return isAuthenticated;
  }
}
