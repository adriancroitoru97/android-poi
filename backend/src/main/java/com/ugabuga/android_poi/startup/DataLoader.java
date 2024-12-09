package com.ugabuga.android_poi.startup;


import com.ugabuga.android_poi.services.RestaurantDataLoader;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RestaurantDataLoader restaurantDataLoader;

    public DataLoader(RestaurantDataLoader restaurantDataLoader) {
        this.restaurantDataLoader = restaurantDataLoader;
    }

    @Override
    public void run(String... args) {
        String csvFilePath = "restaurants.csv"; // Replace with your actual path
        restaurantDataLoader.loadData(csvFilePath);
    }
}
