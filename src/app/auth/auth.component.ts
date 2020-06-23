import { Store } from '@ngrx/store';
import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder.directive";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  private closeSubs: Subscription;
  private storeSubs: Subscription;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  constructor(
              private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSubs = this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if(this.error){
          this.showErrorAlert(this.error);
        }
    });
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

    this.isLoading = true;
    if(this.isLoginMode){
      this.store.dispatch(
        new AuthActions.LoginStart({email:email, password:password})
      );
    }else{
      this.store.dispatch(
        new AuthActions.SignupStart({email:email, password:password})
      );
    }
    form.reset();
  }

  onErrorHandler(){
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(error: string){
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = error;

    componentRef.instance.close.subscribe(() => {
      if(this.closeSubs){
        this.closeSubs.unsubscribe();
      }
      hostViewContainerRef.clear();
    });

  }

  ngOnDestroy() {
    if(this.closeSubs){
      this.closeSubs.unsubscribe();
    }

    if(this.storeSubs){
      this.storeSubs.unsubscribe();
    }
  }

}
