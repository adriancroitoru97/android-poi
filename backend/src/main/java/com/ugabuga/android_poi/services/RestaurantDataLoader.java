package com.ugabuga.android_poi.services;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.Restaurant;
import com.ugabuga.android_poi.repositories.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static io.micrometer.common.util.StringUtils.truncate;

@Service
public class RestaurantDataLoader {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public void loadData(String csvFilePath) {
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

                // Process the CSV file row by row
                while ((row = reader.readNext()) != null) {
                    lineNumber++; // Increment the line number
                    System.out.println(lineNumber);
                    if (lineNumber == 1033363) {
                        System.out.println("shit");
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

                        if (row[7].isEmpty()) {
                            restaurant.setLatitude(null);
                        } else {
                            restaurant.setLatitude(Double.parseDouble(row[7]));
                        }

                        if (row[8].isEmpty()) {
                            restaurant.setLongitude(null);
                        } else {
                            restaurant.setLongitude(Double.parseDouble(row[8]));
                        }

                        // Split tags by commas and process
                        if (row[9].isEmpty()) {
                            restaurant.setTags(null);
                        } else {
                            List<PreferenceType> tags = Arrays.stream(row[9].split(","))
                                    .map(String::trim)
                                    .map(this::processTag) // Process each string
                                    .map(PreferenceType::valueOf) // Map to enum
                                    .toList();
                            restaurant.setTags(tags);
                        }

                        restaurant.setVegetarian(row[10].equalsIgnoreCase("Y"));
                        restaurant.setVegan(row[11].equalsIgnoreCase("Y"));

                        if (row[12].isEmpty()) {
                            restaurant.setAverageRating(null);
                        } else {
                            restaurant.setAverageRating(Double.parseDouble(row[12]));

                        }

                        if (row[13].isEmpty()) {
                            restaurant.setTotalReviewsCount(null);
                        } else {
                            restaurant.setTotalReviewsCount(Integer.parseInt(row[13]));
                        }

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
}
