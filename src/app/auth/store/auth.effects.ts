import { AuthService } from './../auth.service';
import { User } from './../user.model';
import { Router } from '@angular/router';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import {Actions, ofType, Effect} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponse{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string) => {

  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      redirect: true
  });
};

const handleError = (error: any) => {
  let errorMessage = 'An unknown error ocurred.';
  if(!error.error || !error.error.error){
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid credentials.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

    endpointSignin = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseAPIKey;
    endpointLogin = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseAPIKey;

    @Effect()
    authSignup = this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart)=>{
        return this.httpClient.post<AuthResponse>(
          this.endpointSignin,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(error => {
            return handleError(error);
          })
      );
      })
    )

    //dont use subscribe because ngrx subscribes for me!!!
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.httpClient
              .post<AuthResponse>(
                this.endpointLogin,{
                  email: authData.payload.email,
                  password: authData.payload.password,
                  returnSecureToken: true
                }
              ).pipe(
                  tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                  }),
                  map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                  }),
                  catchError(error => {
                    return handleError(error);
                  })
              );
        }),

    );

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if(authSuccessAction.payload.redirect){
          this.router.navigate(['/']);
        }
      })
    );

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        localStorage.removeItem('userData');
        this.authService.clearLogoutTimer();
        this.router.navigate(['/auth']);
      })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
          return { type: 'DUMMY'};
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token){
          const expirationDuration = new Date(loadedUser.tokenExpirationDate.getTime() - new Date().getTime()).getTime();
          //this.autoLogout(expirationDuration);
          this.authService.setLogoutTimer(expirationDuration);

          return  new AuthActions.AuthenticateSuccess({
              email: loadedUser.email,
              userId: loadedUser.id,
              token: loadedUser.token,
              expirationDate: new Date(userData._tokenExpirationDate),
              redirect: false
          });
          
          //const expirationDuration = new Date(loadedUser.tokenExpirationDate.getTime() - new Date().getTime()).getTime();
          //this.autoLogout(expirationDuration);
        }

        return { type: 'DUMMY'};
      })
    );

    constructor(
      private actions$: Actions,
      private httpClient: HttpClient,
      private router: Router,
      private authService: AuthService
      ){

    }
}