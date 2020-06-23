import { Store } from '@ngrx/store';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {map, take, tap} from "rxjs/operators";
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: AuthService, 
    private router: Router,
    private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(
      //No es necesario que este siempre suscrito, solo se debe suscribir una vez cuando sea necesario
      //y retorne el resultado, si esta siempre escuchando puede haber efectos extraños en el Guard.
      take(1),
      map(authState => {
        return authState.user;
      }),
      map(user=>{
        const isAuth = !!user; //user==null?false:true;
        if(isAuth){
          return isAuth;
        }
        return this.router.createUrlTree(['/auth']);
      }),
      // tap(isAuth=>{
      //   if(!isAuth){
      //     this.router.navigate(['/auth'])
      //   }
      // })
    );
  }

}
