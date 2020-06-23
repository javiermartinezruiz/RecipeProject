import * as ShoppingActions from './shopping.actions';
import { Ingredient } from '../../shared/ingredient.model';

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 20)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};


export function shoppingReducer(state: State = initialState, action: ShoppingActions.ShoppingActions){
    switch(action.type){
        case ShoppingActions.ADD_INGREDIENT:
            return {
                //copia el objeto inicial usando el spread operator 
                ...state, 
                 //Copia los ingredientes en el nuevo arreglo de ingredientes usando el spread operator y le agrega el action.payload que es un Ingredient
                ingredients: [...state.ingredients, action.payload ]
            };
        case ShoppingActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...(action.payload as Ingredient[])]
            };

        case ShoppingActions.UPDATE_INGREDIENT:

            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };

        case ShoppingActions.DELETE_INGREDIENT:
            
            return {
                ...state,
                ingredients: state.ingredients.filter((ingr, ingrIndex) => {
                    return ingrIndex !== state.editedIngredientIndex;
                }),
                editedIngredient: null,
                editedIngredientIndex: -1
            };

        case ShoppingActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };
        
        case ShoppingActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };

        default:
            return state;
    }
}
