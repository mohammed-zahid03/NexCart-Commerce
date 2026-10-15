package com.ecommerce.project.security.jwt;

import com.ecommerce.project.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        logger.error("===== AuthTokenFilter START: {} =====", request.getRequestURI());

        try {
            String jwt = parseJwt(request);

            logger.error("===== JWT FOUND: {} =====", jwt != null);

            if (jwt != null) {

                logger.error("===== VALIDATING JWT =====");

                if (jwtUtils.validateJwtToken(jwt)) {

                    logger.error("===== JWT VALID =====");

                    String username = jwtUtils.getUserNameFromJwtToken(jwt);

                    logger.error("===== JWT USERNAME: {} =====", username);

                    UserDetails userDetails =
                            userDetailsService.loadUserByUsername(username);

                    logger.error(
                            "===== USER AUTHORITIES: {} =====",
                            userDetails.getAuthorities()
                    );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                    logger.error(
                            "===== AFTER AUTH SET: {} =====",
                            SecurityContextHolder.getContext().getAuthentication()
                    );

                    logger.error("===== AUTHENTICATION SET =====");
                }
            }

        } catch (Exception e) {
            logger.error(
                    "===== AUTHENTICATION ERROR: {} =====",
                    e.getMessage(),
                    e
            );
        }

        filterChain.doFilter(request, response);
    }

//    private String parseJwt(HttpServletRequest request) {
//        String jwt = jwtUtils.getJwtFromCookies(request);
//        logger.debug("AuthTokenFilter.java: {}", jwt);
//        return jwt;
//    }

    private String parseJwt(HttpServletRequest request) {

        String jwtFromHeader = jwtUtils.getJwtFromHeader(request);
        if (jwtFromHeader != null) {
            return jwtFromHeader.trim();
        }

        String jwtFromCookie = jwtUtils.getJwtFromCookies(request);
        if (jwtFromCookie != null) {
            return jwtFromCookie.trim();
        }

        return null;
    }
}

