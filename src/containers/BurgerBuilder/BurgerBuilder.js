import React, { Component } from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.5,
    bacon: 0.7,
} 

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props)
    
    //     this.state = {
             
    //     }
    // }
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseble: false,
        purchasing: false,
        loading: false
    }

    updatePurchaseState (ingredients) {
    
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        //el is a num 
        .reduce((sum,el) => {
            return sum + el;
        },0);
        this.setState({purchaseble: sum > 0 });
    }
    
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <=0 ){
           return;
        }     
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients );
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        //alert('You Continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Moiz Asif',
                address: {
                    street: 'Test street 1',
                    zipCode: '12432',
                    country: 'Pakistan'
                },
                email: 'test123@testmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
        .then( response => {
            this.setState({loading: false, purchasing: false})
        })
        .catch( error => {
            this.setState({loading: false, purchasing: false})
        });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}/>
        if(this.state.loading){
          orderSummary = <Spinner />;
        }
        return (
            //pass property ingredientAdded
            //disabledInfo key is the value of individual ingredients
          <Auxiliary>
              <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                 {orderSummary}
              </Modal>
              <Burger ingredients = {this.state.ingredients}/>
              <BuildControls 
              ingredientAdded={this.addIngredientHandler}
              ingredientRemoved={this.removeIngredientHandler}
              disabled={disabledInfo}
              purchasable={this.state.purchaseble}
              ordered={this.purchaseHandler}
              price={this.state.totalPrice}/>
          </Auxiliary>
        )
    }
}

export default BurgerBuilder;
