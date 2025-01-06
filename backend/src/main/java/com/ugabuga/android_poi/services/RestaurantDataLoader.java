package com.ugabuga.android_poi.services;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.Restaurant;
import com.ugabuga.android_poi.models.Tag;
import com.ugabuga.android_poi.repositories.RestaurantRepository;
import com.ugabuga.android_poi.repositories.TagRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

import static io.micrometer.common.util.StringUtils.truncate;

@Service
public class RestaurantDataLoader {
    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private TagRepository tagRepository; // Repository to fetch or save Tag entities

    @Transactional
    public void loadData(String csvFilePath) {
        if (restaurantRepository.count() != 0) {
            System.out.println("Data has already been loaded in the database.");
            return;
        }

        try {
            // Load file from the classpath
            ClassPathResource resource = new ClassPathResource(csvFilePath);

            // Use InputStream to create a CSVReader
            try (InputStream inputStream = resource.getInputStream();
                 InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
                 CSVReader reader = new CSVReaderBuilder(inputStreamReader).build()) {

                List<Restaurant> restaurants = new ArrayList<>();
                String[] row;
                int lineNumber = 0;
                int cnt = 0;

                // Process the CSV file row by row
                while ((row = reader.readNext()) != null) {
                    lineNumber++; // Increment the line number
                    cnt++;
                    System.out.println(lineNumber);
                    if(cnt % 2000 == 0) {
                        cnt = 0;
                        restaurantRepository.saveAll(restaurants);
                        entityManager.clear();
                        restaurants.clear();
                    }
                    if (lineNumber == 1) {
                        // Skip the header row
                        continue;
                    }

                    try {
                        // Map the row to a Restaurant object
                        Restaurant restaurant = new Restaurant();
                        restaurant.setRestaurantLink(row[0]);
                        restaurant.setName(row[1]);
                        restaurant.setCountry(row[2]);
                        restaurant.setRegion(row[3]);
                        restaurant.setProvince(row[4]);
                        restaurant.setCity(row[5]);
                        restaurant.setAddress(truncate(row[6], 255));

                        restaurant.setLatitude(row[7].isEmpty() ? null : Double.parseDouble(row[7]));
                        restaurant.setLongitude(row[8].isEmpty() ? null : Double.parseDouble(row[8]));

                        // Split tags by commas and process
                        if (!row[9].isEmpty()) {
                            Set<Tag> tags = Arrays.stream(row[9].split(","))
                                    .map(String::trim)
                                    .map(this::processTag)
                                    .map(this::getOrCreateTag) // Fetch or create Tag entity
                                    .filter(tag -> tag != null) // Remove invalid tags
                                    .collect(Collectors.toSet());
                            restaurant.setTags(tags);
                        }

                        restaurant.setVegetarian(row[10].equalsIgnoreCase("Y"));
                        restaurant.setVegan(row[11].equalsIgnoreCase("Y"));
                        restaurant.setAverageRating(row[12].isEmpty() ? null : Double.parseDouble(row[12]));
                        restaurant.setTotalReviewsCount(row[13].isEmpty() ? null : Integer.parseInt(row[13]));

                        // Add the restaurant to the list
                        restaurants.add(restaurant);

                    } catch (Exception e) {
                        // Log the line number and row content if parsing fails
                        System.err.println("Failed to parse row at line " + lineNumber + ": " + String.join(",", row));
                        e.printStackTrace();
                    }
                }

                // Save all valid restaurants to the database
                restaurantRepository.saveAll(restaurants);
                System.out.println("Data loaded successfully!");
            }
        } catch (Exception e) {
            // Log any general exceptions
            System.err.println("Error occurred while reading the CSV file: " + csvFilePath);
            e.printStackTrace();
        }
    }

    private String processTag(String tag) {
        // Remove non-letter characters and capitalize first letters
        return Arrays.stream(tag.replaceAll("[^a-zA-Z\\s]", " ") // Remove non-letter characters
                        .trim() // Trim whitespace
                        .split("\\s+")) // Split by spaces
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1)) // Capitalize first letter
                .collect(Collectors.joining()); // Join words without spaces
    }

    private Tag getOrCreateTag(String tagName) {
        try {
            // Validate against PreferenceType enum
            PreferenceType.valueOf(tagName);

            // Check if the tag already exists in the database
            return tagRepository.findByName(PreferenceType.valueOf(tagName))
                    .orElseGet(() -> {
                        // Create and save a new tag
                        Tag newTag = new Tag();
                        newTag.setName(PreferenceType.valueOf(tagName));
                        return tagRepository.save(newTag);
                    });

        } catch (IllegalArgumentException e) {
            // Log invalid tag and skip
            System.err.println("Invalid tag: " + tagName + " (processed as: " + tagName + ")");
            return null;
        }
    }
}
