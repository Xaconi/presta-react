import Head from 'next/head';
import Cart from '../components/Cart';
import styles from '../styles/Home.module.css';

import { useEffect } from 'react';

import { initSession, getProducts, addProduct, removeProductFromCart } from '../lib/presta-api';

export default function Home({ products }) {

    useEffect(() => {
        initSession();
    });

    return (
        <div className={styles.container}>
            <Head>
                <title>Presta React | Generate Prestashop customized themes with React and Next.js</title>
                <meta name="description" content="Generate Presashop customized themes with React and Next.js"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Cart></Cart>

            <main className={styles.main}>
                <h1>
                    Welcome to <a href="https://www.prestashop.com/">Presta React!</a>
                </h1>

				<h2>
                    Generate Prestashop customized themes with React and Next.js
                </h2>
            </main>

            <section>
                <h3>
                    The products on this store are these...and they're rendered from Prestashop API!
                </h3>

                <ul>
                    {products.products.map(
                        (product, index) => {
                            return (
                                <li key={index}>
                                    {product.id}
                                    <button onClick={() => {addProduct(product.id) }}>
                                        Add Product {product.id}
                                    </button>
                                    <button onClick={() => {removeProductFromCart(product.id) }}>
                                        Remove Product {product.id}
                                    </button>
                                </li>
                            )
                        }
                    )}
                </ul>
            </section>

            <style jsx>{`
                h1, h2{
                    text-align : center;
                }
            `}</style>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    console.log("SERVER");
    const products = await getProducts();

    return {
        props : {
            products
        }
    };
}
