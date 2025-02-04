class Package {
  int? packageId;
  String? userType;
  String? name;
  double? amount;
  int? duration;
  String? durationUnit;
  int? status;

  Package({
    this.packageId,
    this.userType,
    this.name,
    this.amount,
    this.duration,
    this.durationUnit,
    this.status,
  });

  factory Package.fromJson(Map<String, dynamic> json) {
    return Package(
      packageId: json['package_id'],
      userType: json['user_type'],
      name: json['name'],
      amount: _parseDouble(json['amount']),
      duration: json['duration'],
      durationUnit: json['duration_unit'],
      status: json['status'],
    );
  }

  static double? _parseDouble(dynamic value) {
    if (value is int) {
      return value.toDouble();
    } else if (value is double) {
      return value;
    } else if (value is String) {
      return double.tryParse(value);
    } else {
      return null;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'package_id': packageId,
      'user_type': userType,
      'name': name,
      'amount': amount,
      'duration': duration,
      'duration_unit': durationUnit,
      'status': status,
    };
  }
}
