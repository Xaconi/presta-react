import { useRouter } from 'next/router'
import { getCategoryProducts } from '../lib/presta-api/presta-api-product';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { initSession } from '../lib/presta-api/presta-api';
import {useEffect} from 'react';

const Category = ({ products }) => {
    useEffect(() => {
        initSession();
    });

    const router = useRouter()
    const { category } = router.query

    return (
        <>
            <Cart />
            <p>Category: {category}</p>

            <section class="products">
                {products?.map(
                    (product, index) => {
                        return (
                            <ProductCard
                                key={index}
                                name={product.name[0].value}
                                id={product.id}
                                price={product.price_wt} />
                        )
                    }
                )}
            </section>
        </>
    );
}

export default Category;

export async function getServerSideProps({ req }) {
    const products = await getCategoryProducts(3);

    return {
        props : {
            products
        }
    };
}
