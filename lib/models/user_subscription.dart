class UserSubscription {
  int? subId;
  int? userId;
  String? startDate;
  int? packageId;
  String? status;
  String? endDate;
  int? dependentId;

  UserSubscription({
    this.subId,
    this.userId,
    this.startDate,
    this.packageId,
    this.status,
    this.endDate,
    this.dependentId,
  });

  factory UserSubscription.fromJson(Map<String, dynamic> json) {
    return UserSubscription(
      subId: json['sub_id'],
      userId: json['user_id'],
      startDate: json['start_date'],
      packageId: json['package_id'],
      status: json['status'],
      endDate: json['end_date'],
      dependentId: json['dependent_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sub_id': subId,
      'user_id': userId,
      'start_date': startDate,
      'package_id': packageId,
      'status': status,
      'end_date': endDate,
      'dependent_id': dependentId,
    };
  }
}
