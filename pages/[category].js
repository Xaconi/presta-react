// React
import { useRouter } from 'next/router'
import { useEffect } from 'react';

// Libs
import { getCategories, getCategory, getCategoryByURL } from '../lib/presta-api/presta-api-category';
import { getCategoryProducts } from '../lib/presta-api/presta-api-product';
import { initSession } from '../lib/presta-api/presta-api';
import { getLangs } from '../lib/presta-api/presta-api-lang';

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

export async function getStaticProps( { params, locale } ) {
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
    const langs = await getLangs();

    let paths = [];

    langs.map((lang, indexLang) => {
        for(const categoryData in categories) {
            paths.push({
                params: { category: categories[categoryData].link_rewrite[indexLang].value },
                locale : lang.iso_code
            });
        }
    });

    return {
        paths,
        fallback: false
    };
}
