enum OrderStatus { placed, accepted, shipped, delivered }

class Sale {
  const Sale({
    required this.id,
    required this.date,
    required this.totalAmount,
    required this.status,
    required this.itemsCount,
  });

  final String id;
  final DateTime date;
  final double totalAmount;
  final OrderStatus status;
  final int itemsCount;

  String get statusLabel {
    switch (status) {
      case OrderStatus.placed:
        return 'Order Placed';
      case OrderStatus.accepted:
        return 'Accepted by Distributor';
      case OrderStatus.shipped:
        return 'Shipped by Company';
      case OrderStatus.delivered:
        return 'Delivered';
    }
  }
}
