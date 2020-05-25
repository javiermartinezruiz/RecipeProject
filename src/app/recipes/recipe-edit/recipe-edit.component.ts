import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              ) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params:Params)=> {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
      }
    )
  }

  ngOnDestroy() {
    // Esto no es necesario para esta subscripcion porque angular lo hace por mi
    // pero las subscripciones propias debe eliminarse
    this.subscription.unsubscribe();
  }

}
