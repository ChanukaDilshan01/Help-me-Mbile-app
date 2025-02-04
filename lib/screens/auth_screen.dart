import 'package:flutter/material.dart';
import 'package:food_delivery_app/screens/main_screen.dart';
import 'package:food_delivery_app/screens/onboarding_screen.dart';
import 'package:food_delivery_app/screens/signin_screen.dart';
import 'package:food_delivery_app/services/navigation_methods.dart';
import 'package:food_delivery_app/utils/app_color.dart';
import 'package:food_delivery_app/utils/constant.dart';
import 'package:provider/provider.dart';

import '../models/user_model.dart';
import '../providers/user_provider.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {

  @override
  void initState() {
    findAuthData();
    super.initState();
  }

  void findAuthData() async{
    await getCurrentUser().then((value) {
      if(value==null){
        push(context, const OnboardingScreen());
      }else{
        var user = value;
        if(user.isLoggedIn??false==true){
          push(context, const MainScreen());
        }else{
          push(context, const OnboardingScreen());
        }
      }
    });

  }

  Future<User?> getCurrentUser() async {
    try {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      await userProvider.loadCurrentUserFromPrefs();
      return userProvider.getCurrentUser;
    } catch (e) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Column(
        children: [
          Center(
            child: CircularProgressIndicator(color: AppColor.kPrimary,),
          )
        ],
      ),
    );
  }
}
