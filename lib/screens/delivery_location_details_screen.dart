import 'dart:async';
import 'package:flutter/material.dart';
import 'package:food_delivery_app/models/order_model.dart';
import 'package:food_delivery_app/utils/constant.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:food_delivery_app/utils/app_color.dart';
import 'package:food_delivery_app/widgets/custom_button.dart';
import 'package:food_delivery_app/models/driver.dart';
import 'package:food_delivery_app/services/socket_service.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DeliveryLocationDetailsScreen extends StatefulWidget {
  const DeliveryLocationDetailsScreen(
      {super.key, required this.riderLocation, required this.deliveryLocation, this.driver, required this.deliveryId});
  final LatLng riderLocation;
  final LatLng deliveryLocation;
  final int deliveryId;
  final Driver? driver;

  @override
  State<DeliveryLocationDetailsScreen> createState() =>
      _DeliveryLocationDetailsScreenState();
}

class _DeliveryLocationDetailsScreenState
    extends State<DeliveryLocationDetailsScreen> {

  late SocketService _socketService;
  LatLng destination = const LatLng(37.42796133580664, -122.085749655962);
  LatLng riderLocation = const LatLng(6.985419441041705, 81.05878382208839);
  bool isLoading = true;
  BitmapDescriptor riderIcon = BitmapDescriptor.defaultMarker;
  BitmapDescriptor destinationIcon = BitmapDescriptor.defaultMarker;
  Location location = Location();
  LocationData? currentLocation;
  String? duration;
  String? distance;
  StreamSubscription<Map<String, dynamic>>? _deliveryLocationSubscription;

  @override
  void initState() {
    super.initState();
    _socketService = SocketService();
    _socketService.initialize();
    loadMapData();
    setCustomMarker();
    getPolyPoints(widget.riderLocation, widget.deliveryLocation);
    _listenToDeliveryLocationUpdates();
  }

  void loadMapData() async {
    setCustomMarker().then((_) {
      setState(() {
        destination = widget.deliveryLocation;
        riderLocation = widget.riderLocation;
      });
    });
  }

  void getCurrentLocation() async {
    try {
      currentLocation = await location.getLocation();
    } catch (e) {
      print(e);
    }
  }

  void _listenToDeliveryLocationUpdates() {
    _deliveryLocationSubscription = _socketService
        .deliveryLocationStream(widget.deliveryId)
        .listen((data) {
      if (data.containsKey('longitude') && data.containsKey('latitude')) {
        setState(() {
          riderLocation = LatLng(
            double.parse(data['latitude']),
            double.parse(data['longitude']),
          );
        });
        _updateMapLocation(riderLocation);
        getPolyPoints(riderLocation, destination); // Recalculate the polyline points
      }
    });
  }

  Future<void> _updateMapLocation(LatLng newLocation) async {
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(CameraUpdate.newLatLng(newLocation));
    setState(() {}); // Ensure state updates to refresh the markers and polylines
  }

  @override
  void dispose() {
    _deliveryLocationSubscription?.cancel();
    _socketService.dispose();
    super.dispose();
  }

  final Completer<GoogleMapController> _controller = Completer();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColor.kPrimary,
      appBar: AppBar(
        backgroundColor: AppColor.kPrimary,
        flexibleSpace: FlexibleSpaceBar(
          titlePadding: EdgeInsetsDirectional.only(start: 45, bottom: 16),
          title: Text('Delivery Location',
              style: AppColor.getPoppinsTextStyle(
                  color: Colors.white,
                  fontSize: 20.sp,
                  fontWeight: FontWeight.w600)),
        ),
        leading: IconButton(
          iconSize: 24,
          icon: const Icon(
            Icons.arrow_back_ios_new_outlined,
            color: Colors.white,
            size: 24,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: isLoading ? Container() : Column(
        children: [
          SizedBox(
            height: 10.0.h,
          ),
          Expanded(
            child: Stack(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(24.0.r),
                          topRight: Radius.circular(24.0.r)),
                      color: Colors.transparent,
                    ),
                    child: GoogleMap(
                      initialCameraPosition: CameraPosition(target: destination, zoom: 15),
                      onMapCreated: (GoogleMapController controller) {
                        _controller.complete(controller);
                      },
                      markers: createMarkers(),
                      polylines: {
                        Polyline(
                          polylineId: const PolylineId("route"),
                          points: polyLineCoordinates,
                          color: Colors.black87,
                          width: 4,
                          endCap: Cap.roundCap,
                        ),
                      },
                    ),
                  ),
                  Positioned(
                    bottom: 5,
                    right: 0,
                    left: 0,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                      child: Container(
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18)),
                        child: Column(children: [
                          SizedBox(
                            height: 11.h,
                          ),
                          Padding(
                            padding: const EdgeInsets.only(
                                left: 18.0, right: 18.0, top: 18, bottom: 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Image.asset(
                                  "assets/images/delivery2.png",
                                  width: 40,
                                  height: 40,
                                ),
                                Column(
                                  children: [
                                    Text(widget.driver?.bikeNo ?? 'KD-8529',
                                        style: AppColor.getPoppinsTextStyle(
                                            color: Colors.black,
                                            fontSize: 14.sp,
                                            fontWeight: FontWeight.w600)),
                                    Text(widget.driver?.vehicleType ?? 'Dimo lorry',
                                        style: AppColor.getPoppinsTextStyle(
                                          color: Colors.black,
                                          fontSize: 10.sp,
                                        )),
                                  ],
                                )
                              ],
                            ),
                          ),
                          Divider(),
                          Padding(
                            padding: const EdgeInsets.only(
                                left: 18.0, right: 18.0, top: 10, bottom: 8),
                            child: Row(
                              children: [
                                Text(widget.driver?.name ?? 'S.B. Bandara',
                                    style: AppColor.getPoppinsTextStyle(
                                      color: Colors.black,
                                      fontSize: 12.sp,
                                    )),
                                Spacer(),
                                Image.asset(
                                  "assets/images/message.png",
                                  width: 40,
                                  height: 40,
                                ),
                                SizedBox(
                                  width: 11.w,
                                ),
                                Image.asset(
                                  "assets/images/call.png",
                                  width: 40,
                                  height: 40,
                                ),
                              ],
                            ),
                          ),
                          Divider(),
                          SizedBox(
                            height: 12.0,
                          ),
                          Padding(
                            padding: const EdgeInsets.only(
                                left: 18.0, right: 18.0, top: 0, bottom: 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Distance',
                                    style: AppColor.getPoppinsTextStyle(
                                      color: Colors.black,
                                      fontSize: 12.sp,
                                    )),
                                Text('$distance',
                                    style: AppColor.getPoppinsTextStyle(
                                      fontSize: 12.sp,
                                    )),
                              ],
                            ),
                          ),
                          Divider(),
                          SizedBox(
                            height: 12.0,
                          ),
                          Padding(
                            padding: const EdgeInsets.only(
                                left: 18.0, right: 18.0, top: 0, bottom: 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Estimate Time',
                                    style: AppColor.getPoppinsTextStyle(
                                      color: Colors.black,
                                      fontSize: 12.sp,
                                    )),
                                Text('$duration',
                                    style: AppColor.getPoppinsTextStyle(
                                      fontSize: 12.sp,
                                    )),
                              ],
                            ),
                          ),
                          SizedBox(
                            height: 14.h,
                          )
                        ]),
                      ),
                    ),
                  )
                ]),
          ),
        ],
      ),
    );
  }

  Future<void> setCustomMarker() async {
    riderIcon = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(48, 48)), 'assets/icons/vehicle.png');

    destinationIcon = await BitmapDescriptor.fromAssetImage(
        const ImageConfiguration(size: Size(48, 48)), 'assets/icons/destination.png');
  }

  Set<Marker> createMarkers() {
    Set<Marker> _markers = {};

    if (currentLocation != null) {
      _markers.add(Marker(
        markerId: const MarkerId("currentLocation"),
        position: LatLng(currentLocation!.latitude!, currentLocation!.longitude!),
      ));
    }

    _markers.add(Marker(
      markerId: const MarkerId("destination"),
      position: destination,
      icon: destinationIcon,
    ));

    _markers.add(Marker(
      markerId: const MarkerId("riderLocation"),
      position: riderLocation,
      icon: riderIcon,
    ));

    return _markers;
  }

  List<LatLng> polyLineCoordinates = [];

  Future<void> getPolyPoints(LatLng startLocation, LatLng endLocation) async {
    PolylinePoints polylinePoints = PolylinePoints();
    PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
      MAP_API_KEY,
      PointLatLng(startLocation.latitude, startLocation.longitude),
      PointLatLng(endLocation.latitude, endLocation.longitude),
    );

    if (result.points.isNotEmpty) {
      var estimateDuration = result.duration;
      var estimateDistance = result.distance;

      setState(() {
        polyLineCoordinates.clear();
        for (var point in result.points) {
          polyLineCoordinates.add(LatLng(point.latitude, point.longitude));
        }

        duration = estimateDuration;
        distance = estimateDistance;
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }
}
