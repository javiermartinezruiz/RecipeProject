import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, Subject, throwError} from "rxjs";
import {User} from "./user.model";

export interface AuthResponse{
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId:string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  endpointSignin: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBPozBkUTnIhx6oweE2QWi6pOpuzkdMR94';
  endpointLogin: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBPozBkUTnIhx6oweE2QWi6pOpuzkdMR94';

  constructor(private httpClient: HttpClient) {}

  signUp(email:string, password:string){
    return this.httpClient.post<AuthResponse>(this.endpointSignin,
      {
        email: email,
        password: password,
        returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(response=>{
        this.handleAuth(response.email, response.idToken, response.localId, response.expiresIn);
      })
    );
  }

  login(email:string, password:string){
    return this.httpClient.post<AuthResponse>(this.endpointLogin,{
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(response=>{
        this.handleAuth(response.email, response.localId, response.idToken,  response.expiresIn);
      })
    );
  }

  private handleAuth(email: string, localId: string, idToken: string, expiresIn: string ){
    const expirationDate = new Date(new Date().getTime()+ +expiresIn * 1000)
    const user = new User(
      email,
      localId,
      idToken,
      expirationDate);
    this.user.next(user);
  }

  private handleError(error: HttpErrorResponse){
    let errorMessage = 'An unknown error ocurred.';
    if(!error.error || !error.error.error){
      return throwError(errorMessage);
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid credentials.';
        break;
    }
    return throwError(errorMessage);
  }

}
