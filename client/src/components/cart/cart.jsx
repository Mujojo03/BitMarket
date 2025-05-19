import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css';

const Cart = () => {
    const navigate = useNavigate();

    const cartItems = [
        {
            id: 1,
            name: 'Cotton T-shirt',
            category: 'Shirt',
            price: 44.0,
            image: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img5.webp',
        },
        {
            id: 2,
            name: 'Cotton T-shirt',
            category: 'Shirt',
            price: 44.0,
            image: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img6.webp',
        },
        {
            id: 3,
            name: 'Cotton T-shirt',
            category: 'Shirt',
            price: 44.0,
            image: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img7.webp',
        },
    ];

    const [quantities, setQuantities] = useState(cartItems.map(() => 1));

    const handleQuantityChange = (index, delta) => {
        setQuantities(prev => {
            const updated = [...prev];
            updated[index] = Math.max(0, updated[index] + delta);
            return updated;
        });
    };

    const handleRegister = () => {
        const cartData = cartItems.map((item, index) => ({
            ...item,
            quantity: quantities[index],
        }));

        console.log("Registering cart:", cartData);

        // You can send this data to an API or navigate to a confirmation page
        // For now, just simulate navigation
        navigate('/register', { state: { cart: cartData } });
    };


    const handleRemoveItem = index => {
        const updatedQuantities = [...quantities];
        updatedQuantities.splice(index, 1);
        const updatedItems = [...cartItems];
        updatedItems.splice(index, 1);
        setQuantities(updatedQuantities);
        // You could use state for cartItems too if making it dynamic
    };

    const totalPrice = cartItems.reduce(
        (acc, item, index) => acc + item.price * quantities[index],
        0
    );

    return (
        <section className="h-100 h-custom" style={{ backgroundColor: '#d2c9ff' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12">
                        <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    {/* Cart Items */}
                                    <div className="col-lg-8">
                                        <div className="p-5">
                                            <div className="d-flex justify-content-between align-items-center mb-5">
                                                <h1 className="fw-bold mb-0">Shopping Cart</h1>
                                                <h6 className="mb-0 text-muted">{cartItems.length} items</h6>
                                            </div>
                                            <hr className="my-4" />

                                            {cartItems.map((item, index) => (
                                                <div key={item.id}>
                                                    <div className="row mb-4 d-flex justify-content-between align-items-center">
                                                        <div className="col-md-2">
                                                            <img src={item.image} className="img-fluid rounded-3" alt={item.name} />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <h6 className="text-muted">{item.category}</h6>
                                                            <h6 className="mb-0">{item.name}</h6>
                                                        </div>
                                                        <div className="col-md-3 d-flex">
                                                            <button className="btn btn-link px-2" onClick={() => handleQuantityChange(index, -1)}>
                                                                <i className="fas fa-minus"></i>
                                                            </button>
                                                            <input
                                                                min="0"
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                value={quantities[index]}
                                                                readOnly
                                                            />
                                                            <button className="btn btn-link px-2" onClick={() => handleQuantityChange(index, 1)}>
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <h6 className="mb-0">€ {(item.price * quantities[index]).toFixed(2)}</h6>
                                                        </div>
                                                        <div className="col-md-1 text-end">
                                                            <a href="#!" onClick={() => handleRemoveItem(index)} className="text-muted">
                                                                <i className="fas fa-times"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <hr className="my-4" />
                                                </div>
                                            ))}

                                            <div className="pt-5">
                                                <h6 className="mb-0">
                                                    <a href="/" className="text-body">
                                                        <i className="fas fa-long-arrow-alt-left me-2"></i>Back to shop
                                                    </a>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Section */}
                                    <div className="col-lg-4 bg-body-tertiary">
                                        <div className="p-5">
                                            <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                                            <hr className="my-4" />

                                            <div className="d-flex justify-content-between mb-4">
                                                <h5 className="text-uppercase">Items ({cartItems.length})</h5>
                                                <h5>€ {totalPrice.toFixed(2)}</h5>
                                            </div>

                                            <h5 className="text-uppercase mb-3">Shipping</h5>
                                            <div className="mb-4 pb-2">
                                                <select className="form-select">
                                                    <option value="1">Standard Delivery - €5.00</option>
                                                    <option value="2">Express - €10.00</option>
                                                    <option value="3">Overnight - €20.00</option>
                                                </select>
                                            </div>

                                            <h5 className="text-uppercase mb-3">Give code</h5>
                                            <div className="mb-5">
                                                <div className="form-outline">
                                                    <input type="text" id="form3Examplea2" className="form-control form-control-lg" />
                                                    <label className="form-label" htmlFor="form3Examplea2">Enter your code</label>
                                                </div>
                                            </div>

                                            <hr className="my-4" />

                                            <div className="d-flex justify-content-between mb-5">
                                                <h5 className="text-uppercase">Total price</h5>
                                                <h5>€ {(totalPrice + 5).toFixed(2)}</h5>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-dark btn-block btn-lg"
                                                onClick={handleRegister}
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cart;
// Note: The above code is a simplified version of a shopping cart component.