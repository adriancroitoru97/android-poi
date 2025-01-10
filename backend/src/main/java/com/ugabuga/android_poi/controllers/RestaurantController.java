package com.ugabuga.android_poi.controllers;

import com.ugabuga.android_poi.models.Restaurant;
import com.ugabuga.android_poi.models.User;
import com.ugabuga.android_poi.services.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    /**
     * Retrieve all restaurants with pagination.
     *
     * @param page Page number (default = 0).
     * @param size Page size (default = 10).
     * @return Paginated list of restaurants.
     */
    @GetMapping("/getAll")
    public ResponseEntity<Page<Restaurant>> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(restaurantService.getAllRestaurants(pageable));
    }

    /**
     * Retrieve restaurants filtered by tag with pagination.
     *
     * @param tag  Tag name.
     * @param page Page number (default = 0).
     * @param size Page size (default = 10).
     * @return Paginated list of restaurants filtered by the tag.
     */
    @GetMapping("/getByTag")
    public ResponseEntity<Page<Restaurant>> getRestaurantsByTag(
            @RequestParam String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(restaurantService.getRestaurantsByTag(tag, pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Restaurant>> filterRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean vegetarian,
            @RequestParam(required = false) Boolean vegan,
            @RequestParam(required = false) Double averageRating,
            @RequestParam(required = false) Integer totalReviewsCount,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> filteredRestaurants = restaurantService.filterRestaurants(name, tag, city, vegetarian, vegan,
                averageRating, totalReviewsCount, latitude, longitude, radius, pageable);
        return ResponseEntity.ok(filteredRestaurants);
    }

    @GetMapping("/filterWithScores")
    public ResponseEntity<Page<Restaurant>> filterRestaurantsWithScores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Boolean vegetarian,
            @RequestParam(required = false) Boolean vegan,
            @RequestParam(required = false) Double averageRating,
            @RequestParam(required = false) Integer totalReviewsCount,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User user) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> filteredRestaurants = restaurantService.filterRestaurantsWithScores(user, name, tag, city,
                vegetarian, vegan, averageRating, totalReviewsCount, latitude, longitude, radius, pageable);
        return ResponseEntity.ok(filteredRestaurants);
    }
}
