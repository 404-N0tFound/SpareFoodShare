/*eslint-disable */
import { Component } from "react";
import "./FoodBasket.css";
import {Fade} from "react-awesome-reveal";
import basket from "../pics/basket.svg";
import carrot from "../pics/carrot.svg";
import apple from "../pics/apple.svg";
import broccoli from "../pics/broccoli.svg";
import mushroom from "../pics/mushroom.svg";

class FoodBasket extends Component {
    render() {
        return (
                <Fade triggerOnce>
                    <div className="Basket">
                        <div className="basket-items">
                            <img src={broccoli} className="broccoli" />
                            <img src={apple} className="apple" />
                            <img src={carrot} className="carrot" />
                        </div>
                        <div className="basket-image">
                            <img src={basket} className="basket-svg"/>
                        </div>
                        <div className="basket-items">
                            <img src={mushroom} className="mushroom" />
                        </div>
                    </div>
                </Fade>
            );
    }
}

export default FoodBasket;
