class User {
  bool? isLoggedIn;
  String? createdAt;
  int? userId;
  String? email;
  String? phone;
  String? name;
  String? password;
  String? type;
  String? status;
  String? token;
  String? otp;

  User({
    this.isLoggedIn,
    this.createdAt,
    this.userId,
    this.email,
    this.phone,
    this.name,
    this.password,
    this.type,
    this.status,
    this.token,
    this.otp,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      isLoggedIn: json['is_logged_in'] ?? false,
      createdAt: json['created_at'] ?? '',
      userId: json['user_id'] ?? 0,
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      name: json['name'] ?? '',
      password: json['password'] ?? '',
      type: json['type'] ?? '',
      status: json['status'] is int ? json['status'].toString() : json['status'] ?? '',
      token: json['token'] ?? '',
      otp: json['otp'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'is_logged_in': isLoggedIn ?? false,
      'created_at': createdAt ?? '',
      'user_id': userId ?? 0,
      'email': email ?? '',
      'phone': phone ?? '',
      'name': name ?? '',
      'password': password ?? '',
      'type': type ?? '',
      'status': status ?? '',
      'token': token ?? '',
      'otp': otp ?? '',
    };
  }
}
