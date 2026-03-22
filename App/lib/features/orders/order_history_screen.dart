import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../core/theme.dart';
import '../../models/sale.dart';
import 'order_provider.dart';

class MyOrdersScreen extends ConsumerWidget {
  const MyOrdersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(orderHistoryProvider);
    final pendingCount = orders.where((o) => o.status != OrderStatus.delivered).length;
    final totalAmount = orders.fold<double>(0, (sum, o) => sum + o.totalAmount);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('My Orders', style: Theme.of(context).textTheme.titleLarge)
                .animate()
                .fadeIn(duration: 320.ms)
                .slideY(begin: -0.1, end: 0),
            const SizedBox(height: 10),
            Row(
              children: [
                _chip('Total', '${orders.length}'),
                const SizedBox(width: 8),
                _chip('Pending', '$pendingCount'),
                const SizedBox(width: 8),
                _chip('Value', '₹${totalAmount.toStringAsFixed(0)}'),
              ],
            ).animate(delay: 80.ms).fadeIn(duration: 260.ms),
            const SizedBox(height: 12),
            Expanded(
              child: orders.isEmpty
                  ? const _EmptyOrdersState()
                  : ListView.separated(
                      itemCount: orders.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final order = orders[index];
                        return _OrderHistoryTile(order: order)
                            .animate(delay: (index * 65).ms)
                            .fadeIn(duration: 280.ms)
                            .slideY(begin: 0.08, end: 0);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _chip(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Text('$label: $value', style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF334155))),
    );
  }
}

class _OrderHistoryTile extends StatelessWidget {
  const _OrderHistoryTile({required this.order});

  final Sale order;

  @override
  Widget build(BuildContext context) {
    final color = switch (order.status) {
      OrderStatus.placed => const Color(0xFF64748B),
      OrderStatus.accepted => AgriColors.accent,
      OrderStatus.shipped => const Color(0xFF0EA5E9),
      OrderStatus.delivered => AgriColors.success,
    };

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: () => context.push('/tracking/${order.id}'),
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              Container(
                height: 42,
                width: 42,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.local_shipping_rounded, color: color),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(order.id, style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800)),
                    const SizedBox(height: 2),
                    Text(order.statusLabel, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText)),
                    const SizedBox(height: 3),
                    Text(
                      '${order.itemsCount} items',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '₹${order.totalAmount.toStringAsFixed(0)}',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800),
                  ),
                  Text(
                    DateFormat('dd MMM').format(order.date),
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyOrdersState extends StatelessWidget {
  const _EmptyOrdersState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.inventory_2_outlined, size: 42, color: Color(0xFF64748B)),
            const SizedBox(height: 8),
            Text('No orders found', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 4),
            Text(
              'Your placed orders will appear here.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText),
            ),
          ],
        ),
      ),
    );
  }
}
