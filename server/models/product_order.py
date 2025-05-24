from models.db import db
from sqlalchemy_serializer import SerializerMixin


class ProductOrder(db.Model, SerializerMixin):
    """
    Represents an individual product entry in an order.

    Attributes:
        id (int): Primary key.
        order_id (int): Foreign key to the Order.
        product_id (int): Foreign key to the Product.
        quantity (int): Quantity of this product in the order.
        subtotal (BigInteger): Subtotal cost (price * quantity).
        status (str): Status of this item (e.g., 'packed', 'shipped').

    Relationships:
        order (Order): The parent order this item belongs to.
        product (Product): The product being purchased.
    """
    __tablename__ = 'product_orders'

    serialize_rules = ('-order.product_orders', '-product.product_orders',)

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    quantity = db.Column(db.Integer)
    subtotal = db.Column(db.BigInteger)
    status = db.Column(db.String(50))

    order = db.relationship('Order', back_populates='product_orders')
    product = db.relationship('Product', back_populates='product_orders')


    def calculate_subtotal(self):
        """
        Calculates and sets the subtotal based on the product price and quantity.
        Assumes `product.price_sats` exists and is in satoshis.
        """
        if self.product and self.quantity:
            self.subtotal = self.product.price_sats * self.quantity
        else:
            self.subtotal = 0
