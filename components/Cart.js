import { prestaEvents } from '../lib/presta-api/presta-api';
import { getProduct } from '../lib/presta-api/presta-api-product';
import { useState, useEffect } from 'react';

export default function Cart({cart, products}) {

    useEffect(() => {
        prestaEvents.on('updateCart', async function(cart){
            setCart(cart);

            let cartProductsInfo = new Array();

            if(cart?.associations?.cart_rows && cart.associations.cart_rows.length > 0) {
                cartProductsInfo = await Promise.all(
                    cart?.associations?.cart_rows.map(
                        async (element) => {
                            let product = await getProduct(element.id_product);
                            product.quantity = element.quantity;
                            return product;
                        }
                    )
                );
            } else {
                cartProductsInfo = [];
            }

            setProducts(cartProductsInfo);
        });
    }, []);

    function setCart(cart) {
    }

    function setProducts(products) {
    }

    [cart, setCart] = useState(0);
    [products, setProducts] = useState([]);

    const reducerPrice = (accumulator, currentProduct) => accumulator + parseFloat(currentProduct.price_wt * currentProduct.quantity);
    const reducerQuantity = (accumulator, currentProduct) => accumulator + parseInt(currentProduct.quantity);

    return (
        <>
            <p>Cart</p>
            <p>You have {products?.reduce(reducerQuantity, 0) || 0} items on your cart.</p>

            {products.map(
                (product) => {
                return (<p key={product.id}>{product.quantity}x {product.name[0].value} - {product.price_wt}</p>)
                }
            )}

            <p>Total: {products?.reduce(reducerPrice, 0)}</p>
        </>
    )
}

export async function getStaticProps() {
    console.log("CLIENT CART");

    return {
        props : {
            cart : null,
            products : []
        }
    }
}
