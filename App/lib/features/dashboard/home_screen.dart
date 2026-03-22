import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../core/theme.dart';
import '../../models/sale.dart';
import '../auth/auth_provider.dart';
import '../orders/order_history_screen.dart';
import '../orders/order_provider.dart';
import '../orders/place_order_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      _HomeTab(onNavigate: (tab) => setState(() => _index = tab)),
      const PlaceOrderScreen(),
      const MyOrdersScreen(),
    ];

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF1F5F9), Color(0xFFEFF6FF)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: IndexedStack(index: _index, children: pages),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.shopping_bag_rounded), label: 'Place Order'),
          NavigationDestination(icon: Icon(Icons.receipt_long_rounded), label: 'My Orders'),
        ],
      ),
    );
  }
}

class _HomeTab extends ConsumerWidget {
  const _HomeTab({required this.onNavigate});

  final ValueChanged<int> onNavigate;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final orders = ref.watch(orderHistoryProvider);

    final pendingCount = orders.where((o) => o.status != OrderStatus.delivered).length;
    final deliveredCount = orders.where((o) => o.status == OrderStatus.delivered).length;
    final monthAmount = orders.fold<double>(0, (sum, o) => sum + o.totalAmount);

    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome, ${auth.user?.name ?? 'Farmer'}',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 26),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Manage your feed and chicks orders in one place.',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText),
                        ),
                      ],
                    ),
                  ),
                  IconButton.filledTonal(
                    onPressed: () {
                      ref.read(authControllerProvider.notifier).logout();
                      context.go('/login');
                    },
                    icon: const Icon(Icons.logout_rounded),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 320.ms).slideY(begin: -0.12, end: 0),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: _HeroCard(
                distributor: auth.user?.distributorName ?? 'GreenNest Distributors',
                total: monthAmount,
                pending: pendingCount,
              ).animate(delay: 80.ms).fadeIn(duration: 340.ms).slideY(begin: 0.08, end: 0),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
              child: Row(
                children: [
                  Expanded(
                    child: _MetricCard(
                      title: 'Pending',
                      value: '$pendingCount',
                      accent: AgriColors.accent,
                      icon: Icons.schedule_rounded,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _MetricCard(
                      title: 'Delivered',
                      value: '$deliveredCount',
                      accent: AgriColors.success,
                      icon: Icons.check_circle_rounded,
                    ),
                  ),
                ],
              ).animate(delay: 120.ms).fadeIn(duration: 320.ms),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
              child: Row(
                children: [
                  Expanded(
                    child: _QuickActionButton(
                      label: 'Place New Order',
                      icon: Icons.add_box_rounded,
                      onTap: () => onNavigate(1),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _QuickActionButton(
                      label: 'Order History',
                      icon: Icons.list_alt_rounded,
                      onTap: () => onNavigate(2),
                    ),
                  ),
                ],
              ).animate(delay: 160.ms).fadeIn(duration: 300.ms),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 8),
              child: Row(
                children: [
                  Text('Recent Orders', style: Theme.of(context).textTheme.titleSmall),
                  const Spacer(),
                  TextButton(
                    onPressed: () => onNavigate(2),
                    child: const Text('See all'),
                  ),
                ],
              ),
            ),
          ),
          if (orders.isEmpty)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: _EmptyOrdersCard(),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 18),
              sliver: SliverList.separated(
                itemCount: orders.length > 4 ? 4 : orders.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return _OrderTile(order: order)
                      .animate(delay: (index * 70).ms)
                      .fadeIn(duration: 280.ms)
                      .slideX(begin: 0.08, end: 0);
                },
              ),
            ),
        ],
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard({
    required this.distributor,
    required this.total,
    required this.pending,
  });

  final String distributor;
  final double total;
  final int pending;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [Color(0xFF059669), Color(0xFF10B981)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Distributor: $distributor',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _heroStat('This Month', '₹${total.toStringAsFixed(0)}'),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _heroStat('Pending', '$pending'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _heroStat(String title, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.w600)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20)),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.accent,
    required this.icon,
  });

  final String title;
  final String value;
  final Color accent;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: accent.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            height: 38,
            width: 38,
            decoration: BoxDecoration(
              color: accent.withOpacity(0.14),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: accent, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText)),
                Text(value, style: Theme.of(context).textTheme.titleMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  const _QuickActionButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Ink(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Icon(icon, color: AgriColors.primary),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                label,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderTile extends StatelessWidget {
  const _OrderTile({required this.order});

  final Sale order;

  @override
  Widget build(BuildContext context) {
    final statusColor = switch (order.status) {
      OrderStatus.placed => const Color(0xFF64748B),
      OrderStatus.accepted => AgriColors.accent,
      OrderStatus.shipped => const Color(0xFF0EA5E9),
      OrderStatus.delivered => AgriColors.success,
    };

    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => context.push('/tracking/${order.id}'),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(color: statusColor, shape: BoxShape.circle),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(order.id, style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800)),
                    const SizedBox(height: 2),
                    Text(order.statusLabel, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText)),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('₹${order.totalAmount.toStringAsFixed(0)}', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w800)),
                  Text(DateFormat('dd MMM').format(order.date), style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyOrdersCard extends StatelessWidget {
  const _EmptyOrdersCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          const Icon(Icons.inventory_2_outlined, color: Color(0xFF64748B), size: 40),
          const SizedBox(height: 8),
          Text('No orders yet', style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 4),
          Text(
            'Create your first order from the Place Order tab.',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AgriColors.mutedText),
          ),
        ],
      ),
    );
  }
}
