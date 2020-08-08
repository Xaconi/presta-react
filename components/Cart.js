export default function Cart() {
    return (
        <>
            <p>Cart</p>
        </>
    )
}

export async function getStaticProps() {
    console.log("CLIENT CART");

    return {
        props : {}
    }
}
