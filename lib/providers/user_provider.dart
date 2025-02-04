import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class UserProvider with ChangeNotifier {
  User? _currentUser;

  User? get getCurrentUser {
    return _currentUser;
  }

  Future<void> setCurrentUser(User user) async {
    _currentUser = user;
    try {
      await saveUserToPrefs(user);
      notifyListeners();
    } catch (e) {
      // Handle error
      print('Error setting current user: $e');
    }
  }

  Future<void> loadCurrentUserFromPrefs() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? userData = prefs.getString('user');
      if (userData != null) {
        final Map<String, dynamic> userMap = json.decode(userData);
        _currentUser = User.fromJson(userMap);
        notifyListeners();
      }
    } catch (e) {
      // Handle error
      print('Error loading current user from prefs: $e');
    }
  }

  Future<void> saveUserToPrefs(User user) async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('user', json.encode(user.toJson()));
    } catch (e) {
      // Handle error
      print('Error saving user to prefs: $e');
    }
  }

  Future<void> removeCurrentUser() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.remove('user');
      _currentUser = null;
      notifyListeners();
    } catch (e) {
      // Handle error
      print('Error removing current user: $e');
    }
  }

  Future<void> updateIsLoggedInStatus(bool isLoggedIn) async {
    try {
      if (_currentUser != null) {
        _currentUser?.isLoggedIn = isLoggedIn;
        await saveUserToPrefs(_currentUser!);
        notifyListeners();
      }
    } catch (e) {
      print('Error updating isLogged status: $e');
    }
  }
}