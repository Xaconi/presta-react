import { prestaEvents } from '../lib/presta-api';
import { useState } from 'react';

export default function Cart({cart}) {

    function setCart(cart) {
    }

    [cart, setCart] = useState(0);

    prestaEvents.on('updateCart', function(cart){
        setCart(cart);
    });

    return (
        <>
            <p>Cart</p>
            <p>You have {cart?.associations?.cart_rows.length} items on your cart.</p>
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
