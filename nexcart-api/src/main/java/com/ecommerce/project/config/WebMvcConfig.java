
package com.ecommerce.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String imageLocation = Path.of("images").toAbsolutePath().normalize().toUri().toString();
        String videoLocation = Path.of("videos").toAbsolutePath().normalize().toUri().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations(imageLocation);

        registry.addResourceHandler("/videos/**")
                .addResourceLocations(videoLocation);
    }
}
