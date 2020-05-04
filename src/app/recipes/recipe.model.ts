import {Ingredient} from '../Shared/ingredient.model';

export class Recipe {
    public name: string;
    public description: string;
    public filePath: string;
    public ingredients: Ingredient[];

    constructor(name: string, descripton: string, filePath: string, ingredients: Ingredient[]) {
        this.name = name;
        this.description = descripton;
        this.filePath = filePath;
        this.ingredients = ingredients;
    }
}