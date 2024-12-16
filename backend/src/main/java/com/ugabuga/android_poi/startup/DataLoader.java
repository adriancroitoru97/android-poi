package com.ugabuga.android_poi.startup;


import com.ugabuga.android_poi.models.Restaurant;
import com.ugabuga.android_poi.models.Tag;
import com.ugabuga.android_poi.repositories.RestaurantRepository;
import com.ugabuga.android_poi.services.RestaurantDataLoader;
import com.ugabuga.android_poi.services.TagPopulatorService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RestaurantDataLoader restaurantDataLoader;
    private final TagPopulatorService tagPopulatorService;

    private final RestaurantRepository restaurantRepository;

    // Constructor-based dependency injection
    public DataLoader(RestaurantDataLoader restaurantDataLoader, TagPopulatorService tagPopulatorService, RestaurantRepository restaurantRepository) {
        this.restaurantDataLoader = restaurantDataLoader;
        this.tagPopulatorService = tagPopulatorService;
        this.restaurantRepository = restaurantRepository;
    }

    @Override
    public void run(String... args) {
        tagPopulatorService.populateTags();

        String csvFilePath = "restaurants.csv"; // Replace with your actual path
        restaurantDataLoader.loadData(csvFilePath);

        fetchRestaurantWithTags(1053109L);
    }

    private void fetchRestaurantWithTags(long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);

        if (restaurant != null) {
            System.out.println("Restaurant Details:");
            System.out.println("Name: " + restaurant.getName());
            System.out.println("Country: " + restaurant.getCountry());
            System.out.println("City: " + restaurant.getCity());
            System.out.println("Tags:");
            for (Tag tag : restaurant.getTags()) {
                System.out.println(" - " + tag.getName());
            }
        } else {
            System.out.println("Restaurant with ID " + restaurantId + " not found.");
        }
    }
}
