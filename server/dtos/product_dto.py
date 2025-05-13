from marshmallow import Schema, fields

class ProductResponseDTO(Schema):
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    price_sats = fields.Int()
    img_url = fields.Str()
    stock_quantity = fields.Int()
    created_at = fields.DateTime()
    category = fields.Method("get_category_name")
    seller = fields.Method("get_seller_name")

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_seller_name(self, obj):
        return obj.seller.username if obj.seller else None

