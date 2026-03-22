import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme.dart';
import '../../models/product.dart';
import '../../models/sale.dart';
import 'order_provider.dart';

class PlaceOrderScreen extends ConsumerStatefulWidget {
  const PlaceOrderScreen({super.key});

  @override
  ConsumerState<PlaceOrderScreen> createState() => _PlaceOrderScreenState();
}

class _PlaceOrderScreenState extends ConsumerState<PlaceOrderScreen> {
  ProductType _selectedType = ProductType.feed;

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(catalogProvider).where((p) => p.type == _selectedType).toList();
    final cartState = ref.watch(cartProvider);
    final cartController = ref.read(cartProvider.notifier);
    final totalAmount = cartController.totalAmount;
    final uniqueProducts = cartState.quantities.length;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _headerCard(totalAmount, cartState.totalItems)
                  .animate()
                  .fadeIn(duration: 360.ms)
                  .slideY(begin: -0.18, end: 0),
              const SizedBox(height: 14),
              _typeToggle().animate(delay: 80.ms).fadeIn(duration: 320.ms),
              const SizedBox(height: 10),
              Row(
                children: [
                  _pill('Products', '$uniqueProducts'),
                  const SizedBox(width: 8),
                  _pill('Units', '${cartState.totalItems}'),
                ],
              ).animate(delay: 100.ms).fadeIn(duration: 260.ms),
              const SizedBox(height: 14),
              Expanded(
                child: ListView.separated(
                  itemCount: products.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final product = products[index];
                    final qty = cartState.quantities[product.id] ?? 0;
                    return _productCard(product, qty)
                        .animate(delay: (index * 70).ms)
                        .fadeIn(duration: 280.ms)
                        .slideX(begin: 0.08, end: 0);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: AnimatedSlide(
        duration: const Duration(milliseconds: 260),
        offset: cartState.totalItems > 0 ? Offset.zero : const Offset(0, 1.1),
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 260),
          opacity: cartState.totalItems > 0 ? 1 : 0,
          child: SafeArea(
            top: false,
            child: Container(
              margin: const EdgeInsets.all(12),
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 24,
                    offset: const Offset(0, 14),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Total Amount: ₹${totalAmount.toStringAsFixed(0)}',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AgriColors.primary),
                  ),
                  const SizedBox(height: 10),
                  _SwipeConfirm(
                    key: ValueKey(cartState.totalItems),
                    onConfirmed: () {
                      final history = ref.read(orderHistoryProvider.notifier);
                      final current = history.state;
                      final millis = DateTime.now().millisecondsSinceEpoch;
                      final nextOrder = Sale(
                        id: 'AGP-${24000 + (millis % 1000)}',
                        date: DateTime.now(),
                        totalAmount: totalAmount,
                        status: OrderStatus.placed,
                        itemsCount: cartState.totalItems,
                      );
                      history.state = [nextOrder, ...current];
                      cartController.clear();

                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Order confirmed successfully.')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _headerCard(double totalAmount, int totalItems) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xFF059669), Color(0xFF10B981)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Place Order',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Create feed and chicks orders in one flow.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.white.withOpacity(0.92),
                      ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  totalItems == 0 ? 'No items' : '$totalItems items',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                ),
                Text(
                  '₹${totalAmount.toStringAsFixed(0)}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _pill(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Text(
        '$label: $value',
        style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF334155)),
      ),
    );
  }

  Widget _typeToggle() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFE2E8F0),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: [
          Expanded(child: _toggleChip('Order Feed', ProductType.feed)),
          const SizedBox(width: 6),
          Expanded(child: _toggleChip('Order Chicks', ProductType.chicks)),
        ],
      ),
    );
  }

  Widget _toggleChip(String label, ProductType value) {
    final selected = _selectedType == value;

    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () => setState(() => _selectedType = value),
      child: Container(
        constraints: const BoxConstraints(minHeight: 56),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: selected ? Border.all(color: AgriColors.primary, width: 1.8) : null,
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: selected ? AgriColors.primary : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _productCard(Product product, int quantity) {
    final cart = ref.read(cartProvider.notifier);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Container(
            height: 56,
            width: 56,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(product.icon, style: const TextStyle(fontSize: 28)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(product.name, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                Text(product.unit, style: const TextStyle(fontSize: 16, color: Color(0xFF64748B))),
                const SizedBox(height: 6),
                Text(
                  '₹${product.distributorPrice.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: AgriColors.primary,
                  ),
                ),
              ],
            ),
          ),
          Row(
            children: [
              _stepperButton(Icons.remove_rounded, () => cart.decrement(product.id)),
              Container(
                constraints: const BoxConstraints(minWidth: 40),
                alignment: Alignment.center,
                child: Text(
                  '$quantity',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                ),
              ),
              _stepperButton(Icons.add_rounded, () => cart.increment(product.id)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _stepperButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Ink(
        height: 44,
        width: 44,
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Icon(icon, size: 24),
      ),
    );
  }
}

class _SwipeConfirm extends StatefulWidget {
  const _SwipeConfirm({super.key, required this.onConfirmed});

  final VoidCallback onConfirmed;

  @override
  State<_SwipeConfirm> createState() => _SwipeConfirmState();
}

class _SwipeConfirmState extends State<_SwipeConfirm> {
  double _dragX = 0;
  bool _completed = false;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        const knobSize = 52.0;
        final max = constraints.maxWidth - knobSize - 8;

        return Container(
          height: 56,
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(999),
          ),
          child: Stack(
            children: [
              Center(
                child: Text(
                  _completed ? 'Order Confirmed' : 'Swipe to Confirm Order',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF334155)),
                ),
              ),
              Positioned(
                left: 4 + _dragX,
                top: 2,
                child: GestureDetector(
                  onHorizontalDragUpdate: _completed
                      ? null
                      : (details) {
                          setState(() {
                            _dragX = (_dragX + details.delta.dx).clamp(0.0, max);
                          });
                        },
                  onHorizontalDragEnd: _completed
                      ? null
                      : (_) {
                          if (_dragX >= max * 0.86) {
                            setState(() {
                              _completed = true;
                              _dragX = max;
                            });
                            widget.onConfirmed();
                          } else {
                            setState(() => _dragX = 0);
                          }
                        },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    height: knobSize,
                    width: knobSize,
                    decoration: BoxDecoration(
                      color: _completed ? AgriColors.success : AgriColors.primary,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Icon(
                      _completed ? Icons.check_rounded : Icons.arrow_forward_rounded,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
