import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:food_delivery_app/screens/order_processing_screen.dart';
import 'package:food_delivery_app/utils/app_color.dart';
import 'package:food_delivery_app/widgets/custom_button.dart';
import 'package:food_delivery_app/widgets/slide_page_route.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class DeliveryLocationScreen extends StatefulWidget {
  const DeliveryLocationScreen({super.key});

  @override
  State<DeliveryLocationScreen> createState() => _DeliveryLocationScreenState();
}

class _DeliveryLocationScreenState extends State<DeliveryLocationScreen> {
  static const CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(37.42796133580664, -122.085749655962),
    zoom: 14.4746,
  );

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColor.kPrimary,
      appBar: AppBar(
        backgroundColor: AppColor.kPrimary,
        flexibleSpace: FlexibleSpaceBar(
          titlePadding: EdgeInsetsDirectional.only(start: 45, bottom: 16),
          title: Text('Select Delivery Location',
              style: AppColor.getPoppinsTextStyle(
                  color: Colors.white,
                  fontSize: 16.sp,
                  fontWeight: FontWeight.w400)),
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
      body: Column(
        children: [
          SizedBox(
            height: 10.0.h,
          ),
          Expanded(
            child: Stack(children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(24.0.r),
                        topRight: Radius.circular(24.0.r)),
                    color: Colors.transparent,
                  ),
                  child: GoogleMap(
                    mapType: MapType.hybrid,
                    initialCameraPosition: _kGooglePlex,
                    onMapCreated: (GoogleMapController controller) {
                      //_controller.complete(controller);
                    },
                  ),
                ),
              ),
              Positioned(
                bottom: 5,
                right: 0,
                left: 0,
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 33, vertical: 20),
                  child: CustomButton(
                    width: 200.h,
                    text: "Confirm Deliver Location",
                    callback: () {
                      // Navigator.push(
                      //   context,
                      //   SlidePageRoute(
                      //     builder: (context) => const OrderProcessingScreen(),
                      //   ),
                      // );
                    },
                  ),
                ),
              )
            ]),
          ),
        ],
      ),
    );
  }
}
