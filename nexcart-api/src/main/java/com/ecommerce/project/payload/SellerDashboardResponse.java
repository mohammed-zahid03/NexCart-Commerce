package com.ecommerce.project.payload;

public class SellerDashboardResponse {

    private long totalProducts;
    private long totalOrders;
    private double totalSales;
    private double totalCommission;
    private double sellerEarnings;
    private long pendingOrders;
    private long deliveredOrders;
    private long lowStockProducts;

    public SellerDashboardResponse() {
    }

    public SellerDashboardResponse(
            long totalProducts,
            long totalOrders,
            double totalSales,
            double totalCommission,
            double sellerEarnings,
            long pendingOrders,
            long deliveredOrders,
            long lowStockProducts
    ) {
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
        this.totalCommission = totalCommission;
        this.sellerEarnings = sellerEarnings;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
        this.lowStockProducts = lowStockProducts;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }

    public double getTotalCommission() {
        return totalCommission;
    }

    public void setTotalCommission(double totalCommission) {
        this.totalCommission = totalCommission;
    }

    public double getSellerEarnings() {
        return sellerEarnings;
    }

    public void setSellerEarnings(double sellerEarnings) {
        this.sellerEarnings = sellerEarnings;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }
}