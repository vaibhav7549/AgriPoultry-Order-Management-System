import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme.dart';
import 'auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  final _phoneFormKey = GlobalKey<FormState>();
  final _otpControllers = List.generate(6, (_) => TextEditingController());
  final _otpFocusNodes = List.generate(6, (_) => FocusNode());

  bool _showOtpStep = false;
  bool _verificationSuccess = false;

  @override
  void dispose() {
    _phoneController.dispose();
    for (final c in _otpControllers) {
      c.dispose();
    }
    for (final n in _otpFocusNodes) {
      n.dispose();
    }
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (!(_phoneFormKey.currentState?.validate() ?? false)) {
      return;
    }

    final phone = _phoneController.text.trim();
    await ref.read(authControllerProvider.notifier).sendOtp(phone);

    if (!mounted) {
      return;
    }

    setState(() {
      _showOtpStep = true;
      _verificationSuccess = false;
    });
    _otpFocusNodes.first.requestFocus();
  }

  String _enteredOtp() => _otpControllers.map((c) => c.text).join();

  Future<void> _verifyOtpIfReady() async {
    final otp = _enteredOtp();
    if (otp.length < 6) {
      return;
    }

    final ok = await ref.read(authControllerProvider.notifier).verifyOtp(otp);
    if (!mounted || !ok) {
      return;
    }

    setState(() {
      _verificationSuccess = true;
    });

    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (mounted) {
      context.go('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFEFF6FF), Color(0xFFECFDF5), Color(0xFFF8FAFC)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final panelHeight = (constraints.maxHeight - 110).clamp(340.0, 1200.0);

              return SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          height: 44,
                          width: 44,
                          decoration: BoxDecoration(
                            color: AgriColors.primary,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.eco_rounded, color: Colors.white),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text('AgriPoultry Farmer', style: Theme.of(context).textTheme.titleSmall),
                        ),
                      ],
                    ).animate().fadeIn(duration: 280.ms),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: panelHeight,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.84),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: Colors.white),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 24,
                              offset: const Offset(0, 12),
                            ),
                          ],
                        ),
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 420),
                          switchInCurve: Curves.easeOutCubic,
                          switchOutCurve: Curves.easeInCubic,
                          layoutBuilder: (currentChild, previousChildren) {
                            return Stack(
                              fit: StackFit.expand,
                              children: [
                                ...previousChildren,
                                if (currentChild != null) currentChild,
                              ],
                            );
                          },
                          transitionBuilder: (child, animation) {
                            return SlideTransition(
                              position: Tween<Offset>(begin: const Offset(0.08, 0), end: Offset.zero).animate(animation),
                              child: FadeTransition(opacity: animation, child: child),
                            );
                          },
                          child: _showOtpStep
                              ? _OtpStep(
                                  key: const ValueKey('otp-step'),
                                  phone: authState.phone ?? _phoneController.text.trim(),
                                  otpControllers: _otpControllers,
                                  otpFocusNodes: _otpFocusNodes,
                                  isVerifying: authState.isVerifyingOtp,
                                  verificationSuccess: _verificationSuccess,
                                  onChanged: (index, value) {
                                    if (value.isNotEmpty && index < _otpFocusNodes.length - 1) {
                                      _otpFocusNodes[index + 1].requestFocus();
                                    }
                                    if (value.isEmpty && index > 0) {
                                      _otpFocusNodes[index - 1].requestFocus();
                                    }
                                    _verifyOtpIfReady();
                                  },
                                  onBack: () {
                                    setState(() {
                                      _showOtpStep = false;
                                      _verificationSuccess = false;
                                    });
                                    for (final c in _otpControllers) {
                                      c.clear();
                                    }
                                  },
                                )
                              : _PhoneStep(
                                  key: const ValueKey('phone-step'),
                                  formKey: _phoneFormKey,
                                  phoneController: _phoneController,
                                  isSending: authState.isSendingOtp,
                                  onSendOtp: _sendOtp,
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _PhoneStep extends StatelessWidget {
  const _PhoneStep({
    super.key,
    required this.formKey,
    required this.phoneController,
    required this.isSending,
    required this.onSendOtp,
  });

  final GlobalKey<FormState> formKey;
  final TextEditingController phoneController;
  final bool isSending;
  final VoidCallback onSendOtp;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 8),
          _FarmHeaderCard().animate().fadeIn(duration: 420.ms).slideY(begin: -0.1, end: 0),
          const SizedBox(height: 22),
          Text(
            'Enter your mobile number to continue with OTP login.',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(height: 1.3),
          ),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Container(
                  margin: const EdgeInsets.all(6),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text('+91', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800)),
                ),
                Expanded(
                  child: TextFormField(
                    controller: phoneController,
                    keyboardType: TextInputType.phone,
                    style: Theme.of(context).textTheme.bodyLarge,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    validator: (v) {
                      final value = v?.trim() ?? '';
                      if (value.length != 10) {
                        return 'Enter a valid 10-digit mobile number';
                      }
                      return null;
                    },
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      hintText: 'Mobile Number',
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Spacer(),
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            width: isSending ? 56 : double.infinity,
            height: 56,
            child: FilledButton(
              onPressed: isSending ? null : onSendOtp,
              child: isSending
                  ? const SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.8),
                    )
                  : const Text('Send OTP'),
            ),
          ),
        ],
      ),
    );
  }
}

class _OtpStep extends StatelessWidget {
  const _OtpStep({
    super.key,
    required this.phone,
    required this.otpControllers,
    required this.otpFocusNodes,
    required this.isVerifying,
    required this.verificationSuccess,
    required this.onChanged,
    required this.onBack,
  });

  final String phone;
  final List<TextEditingController> otpControllers;
  final List<FocusNode> otpFocusNodes;
  final bool isVerifying;
  final bool verificationSuccess;
  final void Function(int index, String value) onChanged;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            IconButton(onPressed: onBack, icon: const Icon(Icons.arrow_back_rounded)),
            Text('OTP Verification', style: Theme.of(context).textTheme.titleSmall),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          'We sent a code to +91 $phone',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText),
        ),
        const SizedBox(height: 18),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(otpControllers.length, (index) {
            return SizedBox(
              width: 46,
              child: TextField(
                controller: otpControllers[index],
                focusNode: otpFocusNodes[index],
                keyboardType: TextInputType.number,
                maxLength: 1,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 22),
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                decoration: InputDecoration(
                  counterText: '',
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFCBD5E1), width: 1.6),
                  ),
                ),
                onChanged: (value) => onChanged(index, value),
              ),
            ).animate(delay: (index * 50).ms).fadeIn(duration: 240.ms);
          }),
        ),
        const SizedBox(height: 26),
        if (isVerifying)
          Row(
            children: [
              const SizedBox(
                height: 22,
                width: 22,
                child: CircularProgressIndicator(strokeWidth: 2.8, color: AgriColors.primary),
              ),
              const SizedBox(width: 10),
              Text('Verifying OTP...', style: Theme.of(context).textTheme.bodyLarge),
            ],
          ),
        const Spacer(),
        AnimatedOpacity(
          duration: const Duration(milliseconds: 260),
          opacity: verificationSuccess ? 1 : 0,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: AgriColors.success,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.check_rounded, color: Colors.white, size: 34),
          ),
        ),
      ],
    );
  }
}

class _FarmHeaderCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFFECFDF5), Color(0xFFEFF6FF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              _iconBubble('🌱'),
              const SizedBox(width: 10),
              _iconBubble('🐔'),
              const SizedBox(width: 10),
              _iconBubble('🚜'),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Smart ordering for feed and chicks',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(color: const Color(0xFF065F46)),
          ),
          const SizedBox(height: 3),
          Text(
            'Fast, reliable, farmer-first fulfillment.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: const Color(0xFF166534)),
          ),
        ],
      ),
    );
  }

  Widget _iconBubble(String emoji) {
    return Container(
      height: 52,
      width: 52,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(emoji, style: const TextStyle(fontSize: 26)),
    );
  }
}
