// React
import { useRouter } from 'next/router'
import { useEffect } from 'react';

// Libs
import { getCategories, getCategory, getCategoryByURL } from '../lib/presta-api/presta-api-category';
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

export async function getStaticProps( { params } ) {
    const { category } = params;
    const categoryId = await getCategoryByURL(category);
    const categoryData = await getCategory(categoryId);
    const products = await getCategoryProducts(categoryId);

    return {
        props : {
            categoryData,
            products
        },
        revalidate: 1
    };
}

export async function getStaticPaths() {
    const { categories } = await getCategories();

    const paths = categories.map((categoryData) => ({
        params: { category: categoryData.link_rewrite[0].value },
    }));

    return {
        paths,
        fallback: false
    };
}
