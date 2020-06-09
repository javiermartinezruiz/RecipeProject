import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponse, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  private closeSubs = new Subscription();

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) { }

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
      this.showErrorAlert(error);
      this.error = error;
    });

    form.reset();
  }

  onErrorHandler(){
    this.error = null;
  }

  private showErrorAlert(error: string){
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = error;

    componentRef.instance.close.subscribe(()=>{
      this.closeSubs.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

  ngOnDestroy() {
    if(this.closeSubs){
      this.closeSubs.unsubscribe();
    }
  }

}
