package com.ugabuga.android_poi.services;

import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.Restaurant;
import com.ugabuga.android_poi.repositories.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService  {

    @Autowired
    private final RestaurantRepository restaurantRepository;

    public Page<Restaurant> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable);
    }

    public Page<Restaurant> getRestaurantsByTag(String tag, Pageable pageable) {
        try {
            PreferenceType preferenceType = PreferenceType.valueOf(tag);

            return restaurantRepository.findRestaurantsByTag(preferenceType, pageable);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid tag: " + tag);
        }
    }

    public Page<Restaurant> filterRestaurants(String name, String tag, String city, Boolean vegetarian, Boolean vegan,
                                              Double averageRating, Integer totalReviewsCount,
                                              Double latitude, Double longitude, Pageable pageable) {
        return restaurantRepository.filterByCriteria(name, tag, city, vegetarian, vegan, averageRating, totalReviewsCount,
                latitude, longitude, pageable);
    }
}
