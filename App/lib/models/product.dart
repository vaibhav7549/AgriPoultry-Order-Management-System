enum ProductType { feed, chicks }

class Product {
  const Product({
    required this.id,
    required this.name,
    required this.unit,
    required this.distributorPrice,
    required this.type,
    required this.icon,
  });

  final String id;
  final String name;
  final String unit;
  final double distributorPrice;
  final ProductType type;
  final String icon;
}
