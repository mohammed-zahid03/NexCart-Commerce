package com.ecommerce.project.service;

import com.ecommerce.project.payload.AnalyticsResponse;
import com.ecommerce.project.payload.OrderStatusAnalyticsDTO;
import com.ecommerce.project.payload.TopProductAnalyticsDTO;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ReturnRequestRepository;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.project.model.AppRole;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.ecommerce.project.payload.TopSellerAnalyticsDTO;
import com.ecommerce.project.payload.ReturnStatusAnalyticsDTO;

import java.time.LocalDate;
import java.time.YearMonth;
import com.ecommerce.project.payload.SalesOverTimeDTO;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Override
    public AnalyticsResponse getAnalyticsData() {

        AnalyticsResponse response = new AnalyticsResponse();

        // Existing metrics
        long productCount = productRepository.count();
        long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.getTotalRevenue();

        // Orders today
        LocalDate today = LocalDate.now();

        long ordersToday =
                orderRepository.countByOrderDate(today);

        // Orders this month
        YearMonth currentMonth = YearMonth.now();

        LocalDate monthStart =
                currentMonth.atDay(1);

        LocalDate monthEnd =
                currentMonth.atEndOfMonth();

        long ordersThisMonth =
                orderRepository.countByOrderDateBetween(
                        monthStart,
                        monthEnd
                );

        // Refunds
        Double totalRefunds =
                orderRepository.getTotalRefunds();

        // Average order value
        Double averageOrderValue =
                orderRepository.getAverageOrderValue();

        // Customers
        long customerCount =
                userRepository.countByRoleName(AppRole.ROLE_USER);

        // Sellers
        long sellerCount =
                userRepository.countByRoleName(AppRole.ROLE_SELLER);

        response.setProductCount(
                String.valueOf(productCount)
        );

        response.setTotalOrders(
                String.valueOf(totalOrders)
        );

        response.setTotalRevenue(
                String.valueOf(
                        totalRevenue != null
                                ? totalRevenue
                                : 0
                )
        );

        response.setOrdersToday(
                String.valueOf(ordersToday)
        );

        response.setOrdersThisMonth(
                String.valueOf(ordersThisMonth)
        );

        response.setTotalRefunds(
                String.valueOf(
                        totalRefunds != null
                                ? totalRefunds
                                : 0
                )
        );

        response.setAverageOrderValue(
                String.valueOf(
                        averageOrderValue != null
                                ? averageOrderValue
                                : 0
                )
        );

        response.setCustomerCount(
                String.valueOf(customerCount)
        );

        response.setSellerCount(
                String.valueOf(sellerCount)
        );


        LocalDate salesStartDate = today.minusDays(29);

        List<SalesOverTimeDTO> rawSales =
                orderRepository.getSalesOverTime(
                        salesStartDate,
                        today
                );

        Map<LocalDate, Double> salesMap = new HashMap<>();

        for (SalesOverTimeDTO item : rawSales) {
            salesMap.put(
                    item.getDate(),
                    item.getRevenue()
            );
        }

        List<SalesOverTimeDTO> salesOverTime = new ArrayList<>();

        for (LocalDate date = salesStartDate;
             !date.isAfter(today);
             date = date.plusDays(1)) {

            salesOverTime.add(
                    new SalesOverTimeDTO(
                            date,
                            salesMap.getOrDefault(date, 0.0)
                    )
            );
        }

        response.setSalesOverTime(salesOverTime);

        List<OrderStatusAnalyticsDTO> ordersByStatus =
                orderRepository.getOrdersByStatus();

        response.setOrdersByStatus(ordersByStatus);

        Pageable topProductsPageable = PageRequest.of(0, 5);

        List<TopProductAnalyticsDTO> topProducts =
                orderRepository.getTopProducts(topProductsPageable);

        response.setTopProducts(topProducts);

        Pageable topSellersPageable = PageRequest.of(0, 5);

        List<TopSellerAnalyticsDTO> topSellers =
                orderRepository.getTopSellers(topSellersPageable);

        response.setTopSellers(topSellers);

        List<ReturnStatusAnalyticsDTO> returnsByStatus =
                returnRequestRepository.getReturnsByStatus();

        response.setReturnsByStatus(returnsByStatus);

        return response;
    }

}