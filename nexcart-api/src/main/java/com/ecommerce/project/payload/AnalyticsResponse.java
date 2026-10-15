package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.ecommerce.project.payload.OrderStatusAnalyticsDTO;
import com.ecommerce.project.payload.TopProductAnalyticsDTO;
import com.ecommerce.project.payload.TopSellerAnalyticsDTO;
import com.ecommerce.project.payload.ReturnStatusAnalyticsDTO;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private String productCount;
    private String totalRevenue;
    private String totalOrders;

    private String ordersToday;
    private String ordersThisMonth;
    private String totalRefunds;
    private String averageOrderValue;
    private String customerCount;
    private String sellerCount;
    private List<SalesOverTimeDTO> salesOverTime;
    private List<OrderStatusAnalyticsDTO> ordersByStatus;
    private List<TopProductAnalyticsDTO> topProducts;
    private List<TopSellerAnalyticsDTO> topSellers;
    private List<ReturnStatusAnalyticsDTO> returnsByStatus;
}