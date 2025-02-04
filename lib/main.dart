import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:food_delivery_app/providers/user_provider.dart';
import 'package:food_delivery_app/screens/main_screen.dart';
import 'package:food_delivery_app/screens/order_processing_screen.dart';
import 'package:food_delivery_app/screens/order_reject_screen.dart';
import 'package:food_delivery_app/screens/order_success_screen.dart';
import 'package:food_delivery_app/screens/order_summery.dart';
import 'package:food_delivery_app/screens/select_screen.dart';
import 'package:food_delivery_app/screens/signup_screen.dart';
import 'package:food_delivery_app/screens/splash_screen.dart';
import 'package:provider/provider.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(statusBarColor: Colors.transparent));
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_)=> UserProvider()),
      ],
      child: ScreenUtilInit(
          designSize: const Size(393, 852),
          minTextAdapt: true,
          splitScreenMode: true,
          builder: (context, child) {
            return MaterialApp(
              title: 'HelpMe App',
              debugShowCheckedModeBanner: false,
              theme: ThemeData(
                colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
                useMaterial3: true,
              ),
              home: const SplashScreen(),
            );
          }),
    );
  }
}
