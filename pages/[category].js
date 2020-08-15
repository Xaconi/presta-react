// React
import { useRouter } from 'next/router'
import { useEffect } from 'react';

// Libs
import { getCategory } from '../lib/presta-api/presta-api-category';
import { getCategoryProducts } from '../lib/presta-api/presta-api-product';
import { initSession } from '../lib/presta-api/presta-api';

// Components
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';

// Packages
import parse from 'html-react-parser';

const Category = ({ categoryData, products }) => {
    useEffect(() => {
        initSession();
    });

    const router = useRouter()
    const { category } = router.query

    return (
        <>
            <Cart />
            <p>{categoryData.name[0].value}</p>
            {parse(categoryData.description[0].value)}

            <section className="products">
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
    const categoryData = await getCategory(3);
    const products = await getCategoryProducts(3);

    return {
        props : {
            categoryData,
            products
        }
    };
}
