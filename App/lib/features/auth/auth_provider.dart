import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/user.dart';

final authControllerProvider = StateNotifierProvider<AuthController, AuthState>(
  (ref) => AuthController(),
);

class AuthState {
  const AuthState({
    this.phone,
    this.isSendingOtp = false,
    this.isVerifyingOtp = false,
    this.isAuthenticated = false,
    this.user,
    this.error,
  });

  final String? phone;
  final bool isSendingOtp;
  final bool isVerifyingOtp;
  final bool isAuthenticated;
  final FarmerUser? user;
  final String? error;

  AuthState copyWith({
    String? phone,
    bool? isSendingOtp,
    bool? isVerifyingOtp,
    bool? isAuthenticated,
    FarmerUser? user,
    String? error,
    bool clearError = false,
  }) {
    return AuthState(
      phone: phone ?? this.phone,
      isSendingOtp: isSendingOtp ?? this.isSendingOtp,
      isVerifyingOtp: isVerifyingOtp ?? this.isVerifyingOtp,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      error: clearError ? null : error ?? this.error,
    );
  }
}

class AuthController extends StateNotifier<AuthState> {
  AuthController() : super(const AuthState());

  Future<void> sendOtp(String phone) async {
    state = state.copyWith(
      isSendingOtp: true,
      phone: phone,
      clearError: true,
    );

    await Future<void>.delayed(const Duration(milliseconds: 1300));

    state = state.copyWith(isSendingOtp: false);
  }

  Future<bool> verifyOtp(String otp) async {
    state = state.copyWith(isVerifyingOtp: true, clearError: true);

    await Future<void>.delayed(const Duration(milliseconds: 1100));

    if (otp.length != 6) {
      state = state.copyWith(
        isVerifyingOtp: false,
        error: 'Please enter the 6-digit OTP.',
      );
      return false;
    }

    state = state.copyWith(
      isVerifyingOtp: false,
      isAuthenticated: true,
      user: FarmerUser(
        id: 'farmer-01',
        name: 'Ramesh Patil',
        phone: state.phone ?? '',
        distributorName: 'GreenNest Distributors',
      ),
    );
    return true;
  }

  void logout() {
    state = const AuthState();
  }
}
