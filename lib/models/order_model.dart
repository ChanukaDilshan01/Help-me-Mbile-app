class Order {
  int? orderId;
  String? date;
  String? itemDetails;
  String? inputType;
  int? categoryId;
  int? customerId;
  String? mobileNo;
  String? destinationAddress;
  String? destinationLongitude;
  String? destinationLatitude;
  String? status;
  int? deliveryId;
  String? paymentType;
  String? amount;
  String? paymentStatus;
  String? completeTime;
  String? detailsPic;
  String? customerResponse;
  String? cancelledBy;
  String? cancelReason;

  Order({
    this.orderId,
    this.date,
    this.itemDetails,
    this.inputType,
    this.categoryId,
    this.customerId,
    this.mobileNo,
    this.destinationAddress,
    this.destinationLongitude,
    this.destinationLatitude,
    this.status,
    this.deliveryId,
    this.paymentType,
    this.amount,
    this.paymentStatus,
    this.completeTime,
    this.detailsPic,
    this.customerResponse,
    this.cancelledBy,
    this.cancelReason,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      orderId: json['order_id'] ?? null,
      date: json['date'] ?? '',
      itemDetails: json['item_details'] ?? '',
      inputType: json['input_type'] ?? '',
      categoryId: json['category_id'] ?? null,
      customerId: json['customer_id'] ?? null,
      mobileNo: json['mobile_no'] ?? '',
      destinationAddress: json['destination_address'] ?? '',
      destinationLongitude: json['destination_longitude'] ?? '',
      destinationLatitude: json['destination_latitude'] ?? '',
      status: json['status'] ?? '',
      deliveryId: json['delivery_id'] ?? null,
      paymentType: json['payment_type'] ?? '',
      amount: json['amount'] ?? '',
      paymentStatus: json['payment_status'] ?? '',
      completeTime: json['complete_time'] ?? '',
      detailsPic: json['details_pic'] ?? '',
      customerResponse: json['customer_response'] ?? '',
      cancelledBy: json['cancelled_by'],
      cancelReason: json['cancel_reason'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'order_id': orderId,
      'date': date,
      'item_details': itemDetails,
      'input_type': inputType,
      'category_id': categoryId,
      'customer_id': customerId,
      'mobile_no': mobileNo,
      'destination_address': destinationAddress,
      'destination_longitude': destinationLongitude,
      'destination_latitude': destinationLatitude,
      'status': status,
      'delivery_id': deliveryId,
      'payment_type': paymentType,
      'amount': amount,
      'payment_status': paymentStatus,
      'complete_time': completeTime,
      'details_pic': detailsPic,
      'customer_response': customerResponse,
      'cancelled_by': cancelledBy,
      'cancel_reason': cancelReason,
    };
  }
}