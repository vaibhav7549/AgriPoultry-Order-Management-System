import 'package:flutter/material.dart';

class AgriColors {
  static const Color primary = Color(0xFF059669);
  static const Color primarySoft = Color(0xFF34D399);
  static const Color accent = Color(0xFFF59E0B);
  static const Color background = Color(0xFFF1F5F9);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color danger = Color(0xFFDC2626);
  static const Color success = Color(0xFF16A34A);
  static const Color text = Color(0xFF0F172A);
  static const Color mutedText = Color(0xFF475569);
}

ThemeData buildAgriTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AgriColors.primary,
      primary: AgriColors.primary,
      secondary: AgriColors.accent,
      background: AgriColors.background,
      surface: AgriColors.surface,
      brightness: Brightness.light,
    ),
  );

  final textTheme = base.textTheme.copyWith(
    bodyLarge: const TextStyle(fontSize: 17, fontWeight: FontWeight.w500, color: AgriColors.text),
    bodyMedium: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: AgriColors.text),
    titleLarge: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AgriColors.text),
    titleMedium: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AgriColors.text),
    titleSmall: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: AgriColors.text),
    labelLarge: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
  );

  return base.copyWith(
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: FadeUpwardsPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.windows: FadeUpwardsPageTransitionsBuilder(),
      },
    ),
    scaffoldBackgroundColor: AgriColors.background,
    textTheme: textTheme,
    appBarTheme: AppBarTheme(
      centerTitle: false,
      backgroundColor: Colors.transparent,
      elevation: 0,
      titleTextStyle: textTheme.titleMedium,
      iconTheme: const IconThemeData(color: AgriColors.text),
    ),
    cardTheme: CardThemeData(
      color: AgriColors.surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      shadowColor: Colors.black12,
      surfaceTintColor: AgriColors.surface,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size.fromHeight(56),
        backgroundColor: AgriColors.primary,
        foregroundColor: Colors.white,
        shape: const StadiumBorder(),
        textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.6),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.6),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: AgriColors.primary, width: 3),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      height: 78,
      backgroundColor: Colors.white,
      indicatorColor: AgriColors.primary.withOpacity(0.14),
      labelTextStyle: WidgetStateProperty.all(
        const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
      ),
      iconTheme: WidgetStateProperty.resolveWith(
        (states) => IconThemeData(
          size: 26,
          color: states.contains(WidgetState.selected) ? AgriColors.primary : const Color(0xFF64748B),
        ),
      ),
    ),
  );
}
