import { addProduct } from '../lib/presta-api/presta-api-cart';
import { useState, useEffect } from 'react';

export default function ProductCard({id, name, price}) {
    return(
        <>
            <h3>{name}</h3>
            <span>{price}</span>
            <button onClick={() => {addProduct(id) }}>Add to Cart</button>
        </>
    );
}
