import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  userAuthenticated: boolean = false;

  collapsed = true;
  constructor(private recipeService: RecipeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user=>{
      this.userAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSaveData(){
    this.recipeService.saveData().subscribe(response=>{
      console.log("Response save: ", response)
    })
  }

  onFetchData(){
    this.recipeService.fetchData().subscribe();
  }

}
