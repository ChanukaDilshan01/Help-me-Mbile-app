class OrderItem {
  int? id;
  int? orderId;
  String? itemName;
  double? price;

  OrderItem({
    this.id,
    this.orderId,
    this.itemName,
    this.price,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'],
      orderId: json['order_id'],
      itemName: json['item_name'],
      price: double.tryParse(json['price']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_id': orderId,
      'item_name': itemName,
      'price': price,
    };
  }
}
