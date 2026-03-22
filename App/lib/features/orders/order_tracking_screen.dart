import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../core/theme.dart';
import '../../models/sale.dart';
import 'order_provider.dart';

class OrderTrackingScreen extends ConsumerWidget {
  const OrderTrackingScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final order = ref.watch(orderByIdProvider(orderId));

    if (order == null) {
      return Scaffold(
        appBar: AppBar(title: Text('Track $orderId')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.search_off_rounded, size: 44, color: Color(0xFF64748B)),
                const SizedBox(height: 12),
                Text('Order not found', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Text(
                  'This order may be old or removed from your history.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: const Color(0xFF64748B)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    const steps = [
      'Order Placed',
      'Accepted by Distributor',
      'Shipped by Company',
      'Delivered',
    ];

    final activeStep = switch (order.status) {
      OrderStatus.placed => 0,
      OrderStatus.accepted => 1,
      OrderStatus.shipped => 2,
      OrderStatus.delivered => 3,
    };

    final badgeColor = switch (order.status) {
      OrderStatus.placed => const Color(0xFF64748B),
      OrderStatus.accepted => AgriColors.accent,
      OrderStatus.shipped => const Color(0xFF0EA5E9),
      OrderStatus.delivered => AgriColors.success,
    };

    return Scaffold(
      appBar: AppBar(title: Text('Track $orderId')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(18, 12, 18, 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Live Order Timeline',
                style: Theme.of(context).textTheme.titleLarge,
              ).animate().fadeIn(duration: 360.ms).slideY(begin: -0.14, end: 0),
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: badgeColor.withOpacity(0.35)),
                ),
                child: Row(
                  children: [
                    Container(
                      height: 10,
                      width: 10,
                      decoration: BoxDecoration(color: badgeColor, shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        '${order.statusLabel} • ${DateFormat('dd MMM yyyy').format(order.date)}',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800),
                      ),
                    ),
                    Text(
                      '₹${order.totalAmount.toStringAsFixed(0)}',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AgriColors.primary),
                    ),
                  ],
                ),
              ).animate(delay: 80.ms).fadeIn(duration: 260.ms),
              const SizedBox(height: 10),
              Text(
                'Track every stage of your fulfillment in real-time.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: const Color(0xFF475569)),
              ).animate(delay: 100.ms).fadeIn(duration: 260.ms),
              const SizedBox(height: 24),
              Expanded(
                child: ListView.builder(
                  itemCount: steps.length,
                  itemBuilder: (context, index) {
                    final done = index < activeStep;
                    final active = index == activeStep;
                    return _TimelineStep(
                      title: steps[index],
                      done: done,
                      active: active,
                      isLast: index == steps.length - 1,
                    ).animate(delay: (index * 120).ms).fadeIn(duration: 320.ms).slideX(begin: 0.12, end: 0);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TimelineStep extends StatelessWidget {
  const _TimelineStep({
    required this.title,
    required this.done,
    required this.active,
    required this.isLast,
  });

  final String title;
  final bool done;
  final bool active;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    final color = done || active ? AgriColors.primary : const Color(0xFFCBD5E1);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 36,
          child: Column(
            children: [
              Container(
                height: 24,
                width: 24,
                decoration: BoxDecoration(
                  color: done ? AgriColors.primary : Colors.white,
                  border: Border.all(color: color, width: 2.6),
                  shape: BoxShape.circle,
                ),
                child: done
                    ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
                    : null,
              )
                  .animate(target: active ? 1 : 0)
                  .scaleXY(begin: 0.95, end: 1.08, duration: 900.ms)
                  .then(delay: 100.ms)
                  .scaleXY(begin: 1.08, end: 1.0, duration: 700.ms),
              if (!isLast)
                Container(
                  width: 3,
                  height: 72,
                  color: color,
                ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            margin: const EdgeInsets.only(bottom: 20),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: color.withOpacity(0.45), width: 1.5),
            ),
            child: Text(
              title,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: done || active ? const Color(0xFF0F172A) : const Color(0xFF64748B),
                  ),
            ),
          ),
        ),
      ],
    );
  }
}
