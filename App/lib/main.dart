import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/router.dart';
import 'core/theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: AgriPoultryApp()));
}

class AgriPoultryApp extends ConsumerWidget {
  const AgriPoultryApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'AgriPoultry Farmer App',
      debugShowCheckedModeBanner: false,
      theme: buildAgriTheme(),
      routerConfig: router,
    );
  }
}
