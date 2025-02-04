class Delivery {
  int? deliveryId;
  String? driverLongitude;
  String? driverLatitude;
  int? orderId;
  String? status;
  String? addDate;
  String? completeDate;
  int? routeId;
  int? driverId;

  Delivery({
    this.deliveryId,
    this.driverLongitude,
    this.driverLatitude,
    this.orderId,
    this.status,
    this.addDate,
    this.completeDate,
    this.routeId,
    this.driverId,
  });

  factory Delivery.fromJson(Map<String, dynamic> json) {
    return Delivery(
      deliveryId: json['delivery_id'],
      driverLongitude: json['driver_longitude'],
      driverLatitude: json['driver_latitude'],
      orderId: json['order_id'],
      status: json['status'],
      addDate: json['add_date'],
      completeDate: json['complete_date'],
      routeId: json['route_id'],
      driverId: json['driver_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'delivery_id': deliveryId,
      'driver_longitude': driverLongitude,
      'driver_latitude': driverLatitude,
      'order_id': orderId,
      'status': status,
      'add_date': addDate,
      'complete_date': completeDate,
      'route_id': routeId,
      'driver_id': driverId,
    };
  }
}
