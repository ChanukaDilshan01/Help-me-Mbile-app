class Booking {
  int? bookingId;
  int? customerId;
  double? pickLongitude;
  double? pickLatitude;
  String? pickLocation;
  double? amount;
  int? driverId;
  double? driverLongitude;
  double? driverLatitude;
  String? status;
  String? paymentType;
  String? paymentStatus;
  DateTime? createdAt;
  DateTime? completeAt;
  String? driverGender;
  String? cancelledBy;
  int? chargeId;
  String? cancelReason;
  double? dropLongitude;
  double? dropLatitude;
  String? dropLocation;

  Booking({
    this.bookingId,
    this.customerId,
    this.pickLongitude,
    this.pickLatitude,
    this.pickLocation,
    this.amount,
    this.driverId,
    this.driverLongitude,
    this.driverLatitude,
    this.status,
    this.paymentType,
    this.paymentStatus,
    this.createdAt,
    this.completeAt,
    this.driverGender,
    this.cancelledBy,
    this.chargeId,
    this.cancelReason,
    this.dropLongitude,
    this.dropLatitude,
    this.dropLocation,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      bookingId: json['booking_id'] ?? null,
      customerId: json['customer_id'] ?? null,
      pickLongitude: json['pick_longitude'] != null ? double.parse(json['pick_longitude'].toString()) : null,
      pickLatitude: json['pick_latitude'] != null ? double.parse(json['pick_latitude'].toString()) : null,
      pickLocation: json['pick_location'] ?? '',
      amount: json['amount'] != null ? double.parse(json['amount'].toString()) : null,
      driverId: json['driver_id'] ?? null,
      driverLongitude: json['driver_longitude'] != null ? double.parse(json['driver_longitude'].toString()) : null,
      driverLatitude: json['driver_latitude'] != null ? double.parse(json['driver_latitude'].toString()) : null,
      status: json['status'] ?? '',
      paymentType: json['payment_type'] ?? '',
      paymentStatus: json['payment_status'] ?? '',
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
      completeAt: json['complete_at'] != null ? DateTime.parse(json['complete_at']) : null,
      driverGender: json['driver_gender'] ?? '',
      cancelledBy: json['cancelled_by'] ?? '',
      chargeId: json['charge_id'] ?? null,
      cancelReason: json['cancel_reason'] ?? '',
      dropLongitude: json['drop_longitude'] != null ? double.parse(json['drop_longitude'].toString()) : null,
      dropLatitude: json['drop_latitude'] != null ? double.parse(json['drop_latitude'].toString()) : null,
      dropLocation: json['drop_location'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'booking_id': bookingId,
      'customer_id': customerId,
      'pick_longitude': pickLongitude,
      'pick_latitude': pickLatitude,
      'pick_location': pickLocation,
      'amount': amount,
      'driver_id': driverId,
      'driver_longitude': driverLongitude,
      'driver_latitude': driverLatitude,
      'status': status,
      'payment_type': paymentType,
      'payment_status': paymentStatus,
      'created_at': createdAt?.toIso8601String(),
      'complete_at': completeAt?.toIso8601String(),
      'driver_gender': driverGender,
      'cancelled_by': cancelledBy,
      'charge_id': chargeId,
      'cancel_reason': cancelReason,
      'drop_longitude': dropLongitude,
      'drop_latitude': dropLatitude,
      'drop_location': dropLocation,
    };
  }
}
