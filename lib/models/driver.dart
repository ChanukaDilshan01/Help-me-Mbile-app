class Driver {
  int? driverId;
  String? bikeNo;
  String? phoneNo;
  String? name;
  String? password;
  String? profilePic;
  String? gender;
  String vehicleType;

  Driver({
    this.driverId,
    this.bikeNo,
    this.phoneNo,
    this.name,
    this.password,
    this.profilePic,
    this.gender,
    required this.vehicleType,
  });

  factory Driver.fromJson(Map<String, dynamic> json) {
    return Driver(
      driverId: json['driver_id'],
      bikeNo: json['bike_no'],
      phoneNo: json['phone_no'],
      name: json['name'],
      password: json['password'],
      profilePic: json['profile_pic'],
      gender: json['gender'],
      vehicleType: json['vehicle_type'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'driver_id': driverId,
      'bike_no': bikeNo,
      'phone_no': phoneNo,
      'name': name,
      'password': password,
      'profile_pic': profilePic,
      'gender': gender,
      'vehicle_type': vehicleType,
    };
  }
}
