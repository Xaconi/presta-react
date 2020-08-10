import { prestaEvents } from '../lib/presta-api/presta-api';
import { useState } from 'react';

export default function Cart({cart}) {

    function setCart(cart) {
    }

    [cart, setCart] = useState(0);

    prestaEvents.on('updateCart', function(cart){
        setCart(cart);
    });

    let cartProducts = 0;
    cart?.associations?.cart_rows.map(
        (element) => {
            cartProducts += parseInt(element.quantity);
        }
    );

    return (
        <>
            <p>Cart</p>
            <p>You have {cartProducts} items on your cart.</p>
        </>
    )
}

export async function getStaticProps() {
    console.log("CLIENT CART");

    return {
        props : {
            cart : null
        }
    }
}
