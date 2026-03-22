import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/product.dart';
import '../../models/sale.dart';

final catalogProvider = Provider<List<Product>>((ref) {
  return const [
    Product(
      id: 'f1',
      name: 'Broiler Starter Feed',
      unit: '50kg bag',
      distributorPrice: 1640,
      type: ProductType.feed,
      icon: '🧺',
    ),
    Product(
      id: 'f2',
      name: 'Layer Grower Feed',
      unit: '50kg bag',
      distributorPrice: 1510,
      type: ProductType.feed,
      icon: '🌾',
    ),
    Product(
      id: 'f3',
      name: 'Protein Booster Mash',
      unit: '25kg bag',
      distributorPrice: 980,
      type: ProductType.feed,
      icon: '🥣',
    ),
    Product(
      id: 'c1',
      name: 'Day-old Broiler Chicks',
      unit: 'per chick',
      distributorPrice: 42,
      type: ProductType.chicks,
      icon: '🐥',
    ),
    Product(
      id: 'c2',
      name: 'Kadaknath Chicks',
      unit: 'per chick',
      distributorPrice: 68,
      type: ProductType.chicks,
      icon: '🐣',
    ),
  ];
});

final cartProvider = StateNotifierProvider<CartController, CartState>(
  (ref) => CartController(ref.watch(catalogProvider)),
);

final orderHistoryProvider = StateProvider<List<Sale>>((ref) {
  return [
    Sale(
      id: 'AGP-24011',
      date: DateTime.now().subtract(const Duration(days: 1)),
      totalAmount: 4920,
      status: OrderStatus.accepted,
      itemsCount: 2,
    ),
    Sale(
      id: 'AGP-24009',
      date: DateTime.now().subtract(const Duration(days: 4)),
      totalAmount: 1640,
      status: OrderStatus.shipped,
      itemsCount: 1,
    ),
    Sale(
      id: 'AGP-24003',
      date: DateTime.now().subtract(const Duration(days: 9)),
      totalAmount: 7980,
      status: OrderStatus.delivered,
      itemsCount: 3,
    ),
  ];
});

final orderByIdProvider = Provider.family<Sale?, String>((ref, id) {
  final orders = ref.watch(orderHistoryProvider);
  for (final order in orders) {
    if (order.id == id) {
      return order;
    }
  }
  return null;
});

class CartState {
  const CartState({required this.quantities});

  final Map<String, int> quantities;

  CartState copyWith({Map<String, int>? quantities}) {
    return CartState(quantities: quantities ?? this.quantities);
  }

  int get totalItems => quantities.values.fold(0, (a, b) => a + b);
}

class CartController extends StateNotifier<CartState> {
  CartController(this._catalog) : super(const CartState(quantities: {}));

  final List<Product> _catalog;

  int quantityFor(String id) => state.quantities[id] ?? 0;

  void increment(String id) {
    final updated = Map<String, int>.from(state.quantities);
    updated[id] = (updated[id] ?? 0) + 1;
    state = state.copyWith(quantities: updated);
  }

  void decrement(String id) {
    final updated = Map<String, int>.from(state.quantities);
    final current = updated[id] ?? 0;
    if (current <= 1) {
      updated.remove(id);
    } else {
      updated[id] = current - 1;
    }
    state = state.copyWith(quantities: updated);
  }

  double get totalAmount {
    var total = 0.0;
    for (final entry in state.quantities.entries) {
      final product = _catalog.firstWhere((p) => p.id == entry.key);
      total += product.distributorPrice * entry.value;
    }
    return total;
  }

  void clear() {
    state = const CartState(quantities: {});
  }
}
