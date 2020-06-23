import { Store } from '@ngrx/store';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  userAuthenticated = false;

  collapsed = true;
  constructor(
    private recipeService: RecipeService, 
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
    .pipe(
      map(authState => authState.user)
    )
    .subscribe(
      user => {
      this.userAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSaveData(){
    this.recipeService.saveData().subscribe(response=>{
      console.log("Response save: ", response)
    });
  }

  onFetchData(){
    this.recipeService.fetchData().subscribe();
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

}
