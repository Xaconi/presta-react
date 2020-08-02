import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { initSession, getProducts } from '../lib/presta-api';

export default function Home({ products }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Presta React | Generate Prestashop customized themes with React and Next.js</title>
                <meta name="description" content="Generate Presashop customized themes with React and Next.js"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
                    {products.map(
                        (product, index) => {
                            return (
                                <li key={index}>
                                    {product.id}
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

Home.getInitialProps = async () => {
    const session = await initSession();
    const products = await getProducts();
    return products;
}
