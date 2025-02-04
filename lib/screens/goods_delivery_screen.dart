import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:food_delivery_app/screens/delivery_location_screen.dart';
import 'package:food_delivery_app/screens/order_processing_screen.dart';
import 'package:food_delivery_app/utils/app_color.dart';
import 'package:food_delivery_app/widgets/common_widgets.dart';
import 'package:food_delivery_app/widgets/custom_button.dart';
import 'package:food_delivery_app/widgets/slide_page_route.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:intl/intl.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:permission_handler/permission_handler.dart' as ph;
import 'package:permission_handler/permission_handler.dart';
import 'package:place_picker/entities/location_result.dart';
import 'package:place_picker/widgets/place_picker.dart';
import 'package:location/location.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_helper.dart';
import '../services/navigation_methods.dart';
import '../utils/constant.dart';
import '../widgets/common_inputs.dart';
import '../widgets/phone_input.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:image/image.dart' as img;

class GoodsDeliveryScreen extends StatefulWidget {
  const GoodsDeliveryScreen({super.key});

  @override
  State<GoodsDeliveryScreen> createState() => _GoodsDeliveryScreenState();
}

class _GoodsDeliveryScreenState extends State<GoodsDeliveryScreen> {
  TextEditingController _phoneController = TextEditingController();
  TextEditingController _orderDetailsController = TextEditingController();
  bool isLoading = false;
  int categoryId = 0;
  String selectedAddress = '';
  double selectedLatitude = 0.0;
  double selectedLongitude = 0.0;
  File? _image;

  @override
  void initState() {
    _phoneController.text = currentUserProvider(context).getCurrentUser?.phone??'';
    super.initState();
  }

  Future<void> uploadImage() async {
    if (!(await Permission.storage.isGranted && await Permission.camera.isGranted)) {
      // Request permission if it is not granted
      await Permission.storage.request();
      await Permission.camera.request();
    }

    if (await Permission.camera.isGranted) {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: ImageSource.camera);

      if (pickedFile != null) {
        setState(() {
          _image = File(pickedFile.path);
        });

        // Now you can upload the _image file to your desired destination
        // Example: Upload to server using HTTP package
        // await uploadToServer(_image);
      } else {
        print('No image selected.');
      }
    } else {
      print('Permission not granted');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColor.kPrimary,
      appBar: AppBar(
        backgroundColor: AppColor.kPrimary,
        flexibleSpace: FlexibleSpaceBar(
          titlePadding: EdgeInsetsDirectional.only(start: 45, bottom: 16),
          title: Text('Goods Delivery',
              style: AppColor.getPoppinsTextStyle(
                  color: Colors.white,
                  fontSize: 16.sp,
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
      body: Column(children: [
        SizedBox(
          height: 10.0.h,
        ),
        Expanded(
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(24.0.r),
                  topRight: Radius.circular(24.0.r)),
              color: Colors.white,
            ),
            child: SingleChildScrollView(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    DropdownButtonFormField<String>(
                      hint: Text("Item Type"),
                      decoration: InputDecoration(
                        enabledBorder: AppColor.outlineBorder,
                        focusedBorder: AppColor.outlineBorder,
                        errorBorder: OutlineInputBorder(
                          borderSide: const BorderSide(width: 1, color: Colors.red),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Select some role';
                        } else {
                          return null;
                        }
                      },
                      items: [
                        DropdownMenuItem<String>(
                          value: "1",
                          child: Text("Grocery"),
                        ),
                        DropdownMenuItem<String>(
                          value: "2",
                          child: Text("Pharmacy"),
                        ),
                        DropdownMenuItem<String>(
                          value: "3",
                          child: Text("Other"),
                        ),
                      ],
                      onChanged: (String? value) {
                        if(value!=null){
                          categoryId = int.parse(value);
                          print(categoryId);
                          setState(() {

                          });
                        }

                      },
                    ),
                    SizedBox(
                      height: 23.h,
                    ),
                    Text("Enter your order",
                        style: TextStyle(
                            fontSize: 16, color: AppColor.ktextDarkGrayColor)),
                    SizedBox(
                      height: 8,
                    ),
                    TextFormField(
                      maxLines: 6,
                      controller: _orderDetailsController,
                      decoration: InputDecoration(
                        hintText: "",
                        counterText: "",
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                        hintStyle: TextStyle(
                            color: Colors.grey,
                            fontSize: 16,
                            fontFamily: 'Poppins'),
                        enabledBorder: AppColor.outlineBorder,
                        focusedBorder: AppColor.outlineBorder,
                      ),
                    ),
                    SizedBox(
                      height: 24.h,
                    ),
                    Text("Upload your image",
                        style: TextStyle(
                            fontSize: 16, color: AppColor.ktextDarkGrayColor)),
                    SizedBox(
                      height: 8,
                    ),
                    GestureDetector(
                      onTap: ()async{
                        uploadImage();
                      },
                      child: Container(
                        height: 150.h,
                        width: MediaQuery.sizeOf(context).width,
                        decoration: BoxDecoration(
                            color: const Color(0xFFFFF1E2),
                            borderRadius: BorderRadius.circular(8)),
                        child: _image != null
                            ? Image.file(_image!, fit: BoxFit.cover)
                            : const Icon(Icons.cloud_upload, size: 50),
                      ),
                    ),
                    SizedBox(
                      height: 24.h,
                    ),
                    PhoneWidget(controller: _phoneController,),
                    SizedBox(
                      height: 23.h,
                    ),
                    SizedBox(
                      height: 30.h,
                    ),
                    Visibility(
                      visible: selectedAddress=='',
                      child: CustomButton(
                        text: "Select Location",
                        callback: () async{
                          handleLocation();
                        },
                      ),
                    ),
                    Visibility(
                      visible: selectedAddress!='',
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Container(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              commonText("Selected Address :", fontWeight: FontWeight.bold),
                              commonText(selectedAddress),
                              ElevatedButton(onPressed: (){
                                handleLocation();
                              }, child: const Text("Change"),),
                            ],
                          ),
                        ),
                      ),
                    ),
                    SizedBox(
                      height: 30.h,
                    ),
                    Visibility(
                      visible: selectedAddress!='',
                      child: isLoading?LoadingAnimationWidget.hexagonDots(color: AppColor.kPrimary, size: 50):
                      CustomButton(
                        text: "Place Order",
                        callback: () {
                          _submit();
                        },
                      ),
                    ),
                  ]),
            ),
          ),
        )
      ]),
    );
  }

  void handleLocation() async {
    ph.PermissionStatus permission = await ph.Permission.location.status;

    if (permission == ph.PermissionStatus.granted) {
      Location location = Location();

      try {
        if(selectedLatitude!=0.0 && selectedLongitude!=0.0){
          LocationResult result = await Navigator.of(context).push(MaterialPageRoute(
              builder: (context) =>
                  PlacePicker(MAP_API_KEY,
                    displayLocation: LatLng(selectedLatitude, selectedLongitude),
                  )));

          if (result.formattedAddress != '' && result.formattedAddress != null) {
            setState(() {
              selectedAddress = result.formattedAddress ?? "";
              selectedLatitude = result.latLng?.latitude ?? 0;
              selectedLongitude = result.latLng?.longitude ?? 0;
            });
          }
          print(result.formattedAddress);
        }else{
          await location.getLocation().then((value) async {
            if (value.latitude != null && value.longitude != null) {
              LocationResult result = await Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) =>
                      PlacePicker(MAP_API_KEY,
                        displayLocation: LatLng(value.latitude ?? 0, value.longitude ?? 0),
                      )));

              if (result.formattedAddress != '' && result.formattedAddress != null) {
                setState(() {
                  selectedAddress = result.formattedAddress ?? "";
                  selectedLatitude = result.latLng?.latitude ?? 0;
                  selectedLongitude = result.latLng?.longitude ?? 0;
                });
              }
              print(result.formattedAddress);
            }
          });
        }

      } catch (e) {
        print(e);
      }
    } else {
      // If permission is not granted, request it
      Map<ph.Permission, ph.PermissionStatus> status = await [ph.Permission.location].request();

      if (status[ph.Permission.location] == ph.PermissionStatus.granted) {
        // Permission granted, proceed with location handling
        handleLocation();
      } else {
        // Permission denied, handle accordingly
        print('Location permission denied');
      }
    }
  }

  void _submit()async{
    try{
      var imgUrl = '';
      setState(() {
        isLoading = true;
      });

      if( _phoneController.text!='' && categoryId!= 0){
        if (_image != null) {

          File? compressedFile = await compressImage(_image!);

          var request = http.MultipartRequest(
            'POST',
            Uri.parse('$apiUrl/order/upload-image'),
          );

          request.files.add(await http.MultipartFile.fromPath('image', compressedFile!.path));

          var response = await request.send();

          // Check the response status
          if (response.statusCode == 200) {
            String responseBody = await response.stream.bytesToString();

            // Parse the JSON response
            var jsonResponse = json.decode(responseBody);

            // Extract the imageUrl
            imgUrl = jsonResponse['imageUrl'];

            print('Image URL: $imgUrl');
          } else {
            print('Failed to upload image. Status code: ${response.statusCode}');
          }
        }
        ApiHelper apiHelper = ApiHelper();
        Map<String, dynamic> subData = {
          "date": DateTime.now().toString(),
          "item_details": _orderDetailsController.text,
          "input_type": "text",
          "category_id": categoryId,
          "customer_id": currentUserProvider(context).getCurrentUser?.userId??5501,
          "mobile_no": _phoneController.text,
          "destination_address": selectedAddress,
          "destination_longitude": selectedLongitude,
          "destination_latitude": selectedLatitude,
          "status": "user created order",
          "details_pic":imgUrl
        };

        await apiHelper.postData('order/add', subData).then((response) async {
          if (response != null) {
            setState(() {
              isLoading = false;
            });
            print(response);
            var orderId = response['order']['order_id'];
            SharedPreferences prefs = await SharedPreferences.getInstance();
            prefs.setInt('orderId', orderId).then((value) {
              commonToast("Order Created");
              pushReplacement(context, OrderProcessingScreen(orderId: orderId,));
            });
          }else{
            commonToast("Order added failed");
            setState(() {
              isLoading = false;
            });
          }
        });
      }else{
        commonToast("Please add required fields");
        setState(() {
          isLoading = false;
        });
      }
    }catch(e){
      commonToast("$e");
      print("Error : ${e}");
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<File?> compressImage(File imageFile) async {
    // Decode the image
    img.Image? image = img.decodeImage(await imageFile.readAsBytes());

    // Compress the image with a fixed width and quality
    img.Image compressedImage = img.copyResize(image!, width: 800);

    // Save the compressed image to a temporary file
    File compressedFile = File('${imageFile.path}_compressed.jpg');
    await compressedFile.writeAsBytes(img.encodeJpg(compressedImage, quality: 85));

    return compressedFile;
  }
}
