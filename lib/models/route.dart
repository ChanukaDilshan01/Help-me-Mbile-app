class RouteModel {
  int? routeId;
  String? startLocName;
  String? destinationLocName;
  DateTime? time;

  RouteModel({
    this.routeId,
    this.startLocName,
    this.destinationLocName,
    this.time,
  });

  factory RouteModel.fromJson(Map<String, dynamic> json) {
    return RouteModel(
      routeId: json['route_id'],
      startLocName: json['start_loc_name'],
      destinationLocName: json['destination_loc_name'],
      time: json['time'] != null ? DateTime.parse(json['time']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'route_id': routeId,
      'start_loc_name': startLocName,
      'destination_loc_name': destinationLocName,
      'time': time?.toIso8601String(),
    };
  }
}
