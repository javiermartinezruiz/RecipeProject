import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponse, AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObservable: Observable<AuthResponse>;

    this.isLoading = true;
    if(this.isLoginMode){
      authObservable = this.authService.login(email, password);
    }else{
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(response=>{
      console.log("Response: ", response);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, error=>{
      console.log("Error: ", error);
      this.isLoading = false;
      this.error = error;
    });

    form.reset();
  }

}
