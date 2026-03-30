package com.agripoultry.config;

import com.agripoultry.entity.*;
import com.agripoultry.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final FarmerOrderRepository farmerOrderRepo;
    private final BulkOrderRepository bulkOrderRepo;
    private final TransactionRepository transactionRepo;
    private final NotificationRepository notificationRepo;
    private final InvoiceRepository invoiceRepo;
    private final FarmerPortalOrderRepository farmerPortalOrderRepo;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Database already seeded — skipping DataLoader.");
            return;
        }
        log.info("Seeding database with dummy data...");
        seedUsers();
        seedProducts();
        seedFarmerOrders();
        seedBulkOrders();
        seedTransactions();
        seedNotifications();
        seedInvoices();
        seedFarmerPortalOrders();
        log.info("Database seeding complete!");
    }

    private void seedUsers() {
        // Distributors (IDs will be 1,2,3)
        User d1 = userRepo.save(User.builder().name("Demo Distributor").username("demo_distributor").phone("9876543210").password("dist@123").role(User.Role.DISTRIBUTOR).company("Farm Connect Distributors").email("demo@farmconnect.com").address("123 Market Road, Kolhapur, Maharashtra").avatar("D").region("Kolhapur").build());
        User d2 = userRepo.save(User.builder().name("Ravi Supplies").username("ravi_dist").phone("9123456780").password("ravi@123").role(User.Role.DISTRIBUTOR).company("Ravi Agro Distributors").email("ravi@agro.com").address("45 Supply Lane, Pune, Maharashtra").avatar("R").region("Pune").build());
        User d3 = userRepo.save(User.builder().name("City Hatcheries").username("city_hatch").phone("9988776655").password("city@123").role(User.Role.DISTRIBUTOR).company("City Hatcheries Pvt Ltd").email("city@hatch.com").address("78 Hatch Road, Mumbai").avatar("C").region("Mumbai").build());

        // Companies (IDs will be 4,5)
        userRepo.save(User.builder().name("AgriPoultry Corp").username("agripoultry_corp").phone("9000000001").password("admin@123").role(User.Role.COMPANY).company("AgriPoultry Corp Pvt Ltd").email("admin@agripoultry.com").address("HQ, Industrial Area, Sangli").avatar("A").department("Operations").build());
        userRepo.save(User.builder().name("Poultry Manager").username("poultry_manager").phone("9000000002").password("manager@123").role(User.Role.COMPANY).company("AgriPoultry Corp Pvt Ltd").email("manager@agripoultry.com").address("Branch Office, Kolhapur").avatar("P").department("Sales").build());

        // Farmers (IDs will be 6,7,8,9,10)
        userRepo.save(User.builder().name("Ramu Kaka").username("ramu_kaka").phone("9876501234").password("ramu@123").role(User.Role.FARMER).email("ramu@farm.com").avatar("R").village("Shirol").taluka("Shirol").district("Kolhapur").state("Maharashtra").assignedDistributor(d1).build());
        userRepo.save(User.builder().name("Suresh Patil").username("suresh_patil").phone("9123401234").password("suresh@123").role(User.Role.FARMER).email("suresh@farm.com").avatar("S").village("Kagal").taluka("Kagal").district("Kolhapur").state("Maharashtra").assignedDistributor(d1).build());
        userRepo.save(User.builder().name("Anita More").username("anita_more").phone("9988001234").password("anita@123").role(User.Role.FARMER).email("anita@farm.com").avatar("A").village("Ichalkaranji").taluka("Hatkanangle").district("Kolhapur").state("Maharashtra").assignedDistributor(d2).build());
        userRepo.save(User.builder().name("Vijay Jadhav").username("vijay_jadhav").phone("9765001234").password("vijay@123").role(User.Role.FARMER).email("vijay@farm.com").avatar("V").village("Nandani").taluka("Karveer").district("Kolhapur").state("Maharashtra").assignedDistributor(d1).build());
        userRepo.save(User.builder().name("Meena Chavan").username("meena_chavan").phone("9654001234").password("meena@123").role(User.Role.FARMER).email("meena@farm.com").avatar("M").village("Peth Vadgaon").taluka("Hatkananagale").district("Kolhapur").state("Maharashtra").assignedDistributor(d3).build());

        log.info("Seeded 10 users (3 distributors, 2 companies, 5 farmers)");
    }

    private void seedProducts() {
        productRepo.save(Product.builder().productCode("p1").productName("Starter Feed").category("Feed").unit("bags").costPrice(bd(900)).suggestedDistributorPrice(bd(1000)).suggestedFarmerPrice(bd(1200)).emoji("🌾").stock("High").minOrder(10).description("Nutritious starter feed for young chicks (0-4 weeks)").type(Product.ProductType.FEED).build());
        productRepo.save(Product.builder().productCode("p2").productName("Finisher Feed").category("Feed").unit("bags").costPrice(bd(1100)).suggestedDistributorPrice(bd(1300)).suggestedFarmerPrice(bd(1500)).emoji("🌾").stock("Medium").minOrder(10).description("High-protein finisher feed for market-ready birds").type(Product.ProductType.FEED).build());
        productRepo.save(Product.builder().productCode("p3").productName("Broiler Chicks").category("Chicks").unit("chicks").costPrice(bd(28)).suggestedDistributorPrice(bd(32)).suggestedFarmerPrice(bd(40)).emoji("🐣").stock("Low").minOrder(100).description("Day-old broiler chicks, vaccinated and healthy").type(Product.ProductType.CHICKS).build());
        productRepo.save(Product.builder().productCode("p4").productName("Layer Chicks").category("Chicks").unit("chicks").costPrice(bd(35)).suggestedDistributorPrice(bd(40)).suggestedFarmerPrice(bd(50)).emoji("🐥").stock("High").minOrder(100).description("Day-old layer chicks for egg production").type(Product.ProductType.CHICKS).build());
        productRepo.save(Product.builder().productCode("p5").productName("Premium Feed").category("Feed").unit("bags").costPrice(bd(450)).suggestedDistributorPrice(bd(500)).suggestedFarmerPrice(bd(650)).emoji("🌿").stock("Medium").minOrder(20).description("Organic premium feed blend with added minerals").type(Product.ProductType.FEED).build());
        productRepo.save(Product.builder().productCode("p6").productName("Vaccine Pack").category("Healthcare").unit("packs").costPrice(bd(200)).suggestedDistributorPrice(bd(250)).suggestedFarmerPrice(bd(320)).emoji("💉").stock("High").minOrder(5).description("Complete vaccination kit for poultry flocks").type(Product.ProductType.HEALTHCARE).build());
        log.info("Seeded 6 products");
    }

    private void seedFarmerOrders() {
        User dist = userRepo.findById(1).orElse(null); // Demo Distributor
        Object[][] data = {
            {"FO-1001","F001","Ramu Kaka","9812345001","Premium Feed",50,650,32500,"Pending","2026-03-25","Deliver before weekend"},
            {"FO-1002","F002","Suresh Patil","9812345002","Layer Chicks",200,50,10000,"Delivered","2026-03-24",""},
            {"FO-1003","F003","Ganesh Jadhav","9812345003","Starter Feed",30,1200,36000,"Delivered","2026-03-23","Regular monthly order"},
            {"FO-1004","F004","Prakash Shinde","9812345004","Broiler Chicks",500,40,20000,"Cancelled","2026-03-22","Customer cancelled"},
            {"FO-1005","F005","Rajesh Deshmukh","9812345005","Finisher Feed",25,1500,37500,"Pending","2026-03-22",""},
            {"FO-1006","F006","Anil More","9812345006","Vaccine Pack",10,320,3200,"Delivered","2026-03-21","Seasonal vaccination"},
            {"FO-1007","F007","Vijay Kulkarni","9812345007","Premium Feed",40,650,26000,"Pending","2026-03-20",""},
            {"FO-1008","F009","Manoj Gaikwad","9812345009","Starter Feed",60,1200,72000,"Delivered","2026-03-19","Bulk purchase"},
            {"FO-1009","F010","Deepak Nikam","9812345010","Layer Chicks",300,50,15000,"Pending","2026-03-18",""},
            {"FO-1010","F011","Sanjay Bhosale","9812345011","Finisher Feed",15,1500,22500,"Delivered","2026-03-17",""},
            {"FO-1011","F013","Kiran Chavan","9812345013","Broiler Chicks",1000,40,40000,"Delivered","2026-03-16","Large order"},
            {"FO-1012","F015","Mahesh Yadav","9812345015","Premium Feed",20,650,13000,"Cancelled","2026-03-15","Payment issue"},
        };
        for (Object[] d : data) {
            farmerOrderRepo.save(FarmerOrder.builder()
                .orderId((String)d[0]).farmerIdCode((String)d[1]).farmerName((String)d[2]).farmerPhone((String)d[3])
                .product((String)d[4]).qty((Integer)d[5]).unitPrice(bd((Integer)d[6])).amount(bd((Integer)d[7]))
                .status((String)d[8]).date((String)d[9]).notes((String)d[10]).distributor(dist).build());
        }
        log.info("Seeded 12 farmer orders");
    }

    private void seedBulkOrders() {
        Object[][] orders = {
            {"BO-2001","D001","Farm Connect Distributors",105000,"New Orders","2026-03-25","9876543210"},
            {"BO-2002","D002","Ravi Agro Distributors",160000,"New Orders","2026-03-25","9123456780"},
            {"BO-2003","D003","City Hatcheries Pvt Ltd",145000,"New Orders","2026-03-24","9988776655"},
            {"BO-2004","D001","Farm Connect Distributors",260000,"Processing","2026-03-23","9876543210"},
            {"BO-2005","D002","Ravi Agro Distributors",214000,"Processing","2026-03-22","9123456780"},
            {"BO-2006","D003","City Hatcheries Pvt Ltd",25000,"Processing","2026-03-21","9988776655"},
            {"BO-2007","D001","Farm Connect Distributors",150000,"Shipped","2026-03-20","9876543210"},
            {"BO-2008","D002","Ravi Agro Distributors",160000,"Shipped","2026-03-19","9123456780"},
            {"BO-2009","D003","City Hatcheries Pvt Ltd",210000,"Shipped","2026-03-18","9988776655"},
            {"BO-2010","D001","Farm Connect Distributors",320000,"Delivered","2026-03-17","9876543210"},
            {"BO-2011","D002","Ravi Agro Distributors",250000,"Delivered","2026-03-16","9123456780"},
            {"BO-2012","D003","City Hatcheries Pvt Ltd",112500,"Delivered","2026-03-15","9988776655"},
        };
        String[][][] itemsData = {
            {{"Starter Feed","100","1000"},{"Vaccine Pack","20","250"}},
            {{"Broiler Chicks","5000","32"}},
            {{"Layer Chicks","3000","40"},{"Premium Feed","50","500"}},
            {{"Finisher Feed","200","1300"}},
            {{"Starter Feed","150","1000"},{"Broiler Chicks","2000","32"}},
            {{"Vaccine Pack","100","250"}},
            {{"Premium Feed","300","500"}},
            {{"Layer Chicks","4000","40"}},
            {{"Finisher Feed","100","1300"},{"Starter Feed","80","1000"}},
            {{"Broiler Chicks","10000","32"}},
            {{"Starter Feed","250","1000"}},
            {{"Premium Feed","200","500"},{"Vaccine Pack","50","250"}},
        };
        for (int i = 0; i < orders.length; i++) {
            Object[] o = orders[i];
            BulkOrder bo = BulkOrder.builder()
                .orderId((String)o[0]).distributorIdCode((String)o[1]).distributorName((String)o[2])
                .totalValue(bd((Integer)o[3])).status((String)o[4]).date((String)o[5]).contact((String)o[6])
                .build();
            List<BulkOrderItem> items = new ArrayList<>();
            for (String[] it : itemsData[i]) {
                items.add(BulkOrderItem.builder().product(it[0]).qty(Integer.parseInt(it[1])).price(bd(Integer.parseInt(it[2]))).bulkOrder(bo).build());
            }
            bo.setItems(items);
            bulkOrderRepo.save(bo);
        }
        log.info("Seeded 12 bulk orders");
    }

    private void seedTransactions() {
        Object[][] data = {
            {"TXN-001","2026-03-25","Farmer Order #FO-1001 — Ramu Kaka",32500,0,1245000,"sale"},
            {"TXN-002","2026-03-24","Farmer Order #FO-1002 — Suresh Patil",10000,0,1212500,"sale"},
            {"TXN-003","2026-03-24","Payment to AgriPoultry Corp — NEFT",0,200000,1202500,"payment"},
            {"TXN-004","2026-03-23","Farmer Order #FO-1003 — Ganesh Jadhav",36000,0,1402500,"sale"},
            {"TXN-005","2026-03-22","Bulk Order #BO-2004 — Feed supplies",0,260000,1366500,"purchase"},
            {"TXN-006","2026-03-22","Farmer Order #FO-1005 — Rajesh Deshmukh",37500,0,1626500,"sale"},
            {"TXN-007","2026-03-21","Farmer Order #FO-1006 — Anil More",3200,0,1589000,"sale"},
            {"TXN-008","2026-03-20","Farmer Order #FO-1007 — Vijay Kulkarni",26000,0,1585800,"sale"},
            {"TXN-009","2026-03-20","Payment to AgriPoultry Corp — UPI",0,150000,1559800,"payment"},
            {"TXN-010","2026-03-19","Farmer Order #FO-1008 — Manoj Gaikwad",72000,0,1709800,"sale"},
            {"TXN-011","2026-03-18","Farmer Order #FO-1009 — Deepak Nikam",15000,0,1637800,"sale"},
            {"TXN-012","2026-03-17","Farmer Order #FO-1010 — Sanjay Bhosale",22500,0,1622800,"sale"},
            {"TXN-013","2026-03-17","Payment to AgriPoultry Corp — Cash",0,100000,1600300,"payment"},
            {"TXN-014","2026-03-16","Farmer Order #FO-1011 — Kiran Chavan",40000,0,1700300,"sale"},
            {"TXN-015","2026-03-15","Bulk Order #BO-2007 — Premium Feed",0,150000,1660300,"purchase"},
            {"TXN-016","2026-03-14","Commission bonus — March target",25000,0,1810300,"bonus"},
            {"TXN-017","2026-03-13","Payment to AgriPoultry Corp — NEFT",0,300000,1785300,"payment"},
            {"TXN-018","2026-03-12","Transport charges — Route A",0,12000,1485300,"expense"},
            {"TXN-019","2026-03-11","Farmer Orders batch — 5 orders",85000,0,1497300,"sale"},
            {"TXN-020","2026-03-10","Payment to AgriPoultry Corp — UPI",0,250000,1412300,"payment"},
        };
        for (Object[] d : data) {
            transactionRepo.save(Transaction.builder()
                .txnId((String)d[0]).date((String)d[1]).description((String)d[2])
                .credit(bd((Integer)d[3])).debit(bd((Integer)d[4])).balance(bd((Integer)d[5]))
                .type((String)d[6]).userIdCode("D001").build());
        }
        log.info("Seeded 20 transactions");
    }

    private void seedNotifications() {
        Object[][] data = {
            {"N001","New Order Placed","Ramu Kaka placed order #FO-1001 for Premium Feed","2 mins ago",false,"order"},
            {"N002","Payment Received","Payment of ₹200,000 received via NEFT","15 mins ago",false,"payment"},
            {"N003","Order Status Update","Bulk order #BO-2004 moved to Processing","1 hour ago",false,"status"},
            {"N004","Low Stock Alert","Broiler Chicks stock is running low","2 hours ago",true,"alert"},
            {"N005","New Order Placed","Suresh Patil placed order #FO-1002 for Layer Chicks","3 hours ago",true,"order"},
            {"N006","Payment Due Reminder","Outstanding payment of ₹450K due to AgriPoultry Corp","5 hours ago",true,"alert"},
            {"N007","Order Delivered","Bulk order #BO-2010 has been delivered","8 hours ago",true,"status"},
            {"N008","New Farmer Registered","Mahesh Yadav added as new farmer","1 day ago",true,"system"},
            {"N009","Monthly Report Ready","March 2026 financial report is now available","1 day ago",true,"system"},
            {"N010","Order Cancelled","Prakash Shinde cancelled order #FO-1004","2 days ago",true,"order"},
            {"N011","Price Update","Broiler Chicks base price updated to ₹32/unit","2 days ago",true,"system"},
            {"N012","Payment Received","City Hatcheries paid ₹112,500 via NEFT","3 days ago",true,"payment"},
            {"N013","Bulk Order Shipped","Order #BO-2007 shipped via Logistics Partner A","3 days ago",true,"status"},
            {"N014","System Maintenance","Scheduled maintenance on March 28, 2-4 AM","4 days ago",true,"system"},
            {"N015","New Distributor","Valley Supplies has been onboarded","5 days ago",true,"system"},
        };
        for (Object[] d : data) {
            notificationRepo.save(Notification.builder()
                .notifId((String)d[0]).title((String)d[1]).message((String)d[2])
                .time((String)d[3]).read((Boolean)d[4]).type((String)d[5]).userIdCode("D001").build());
        }
        log.info("Seeded 15 notifications");
    }

    private void seedInvoices() {
        Object[][] data = {
            {"INV-001","2026-03-25",105000,"Pending","BO-2001"},
            {"INV-002","2026-03-23",260000,"Paid","BO-2004"},
            {"INV-003","2026-03-20",150000,"Paid","BO-2007"},
            {"INV-004","2026-03-17",320000,"Paid","BO-2010"},
            {"INV-005","2026-03-14",85000,"Overdue","BO-2002"},
            {"INV-006","2026-03-12",210000,"Paid","BO-2009"},
        };
        for (Object[] d : data) {
            invoiceRepo.save(Invoice.builder()
                .invoiceId((String)d[0]).date((String)d[1]).amount(bd((Integer)d[2]))
                .status((String)d[3]).orderId((String)d[4]).build());
        }
        log.info("Seeded 6 invoices");
    }

    private void seedFarmerPortalOrders() {
        Object[][] data = {
            {"FO-3001","F001","Premium Feed",50,500,25000,"2026-03-20","Pending",null,"Please deliver before month end"},
            {"FO-3002","F001","Layer Chicks",200,40,8000,"2026-03-10","Delivered","2026-03-14",null},
            {"FO-3003","F001","Starter Feed",30,1000,30000,"2026-02-28","Shipped",null,null},
            {"FO-3004","F001","Broiler Chicks",100,32,3200,"2026-02-15","Delivered",null,null},
            {"FO-3005","F001","Finisher Feed",20,1300,26000,"2026-01-30","Delivered",null,null},
            {"FO-3006","F001","Vaccine Pack",5,250,1250,"2026-01-10","Cancelled",null,null},
            {"FO-3007","F002","Starter Feed",10,1000,10000,"2026-03-25","Pending",null,null},
            {"FO-3008","F002","Layer Chicks",100,40,4000,"2026-03-15","Delivered","2026-03-18",null},
            {"FO-3009","F003","Broiler Chicks",50,32,1600,"2026-03-22","Pending",null,null},
        };
        for (Object[] d : data) {
            farmerPortalOrderRepo.save(FarmerPortalOrder.builder()
                .orderId((String)d[0]).farmerIdCode((String)d[1]).product((String)d[2])
                .qty((Integer)d[3]).unitPrice(bd((Integer)d[4])).amount(bd((Integer)d[5]))
                .date((String)d[6]).status((String)d[7]).deliveredDate((String)d[8]).notes((String)d[9]).build());
        }
        log.info("Seeded 9 farmer portal orders");
    }

    private BigDecimal bd(int val) { return BigDecimal.valueOf(val); }
}
