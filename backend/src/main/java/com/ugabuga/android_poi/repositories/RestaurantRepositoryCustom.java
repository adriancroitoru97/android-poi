package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantRepositoryCustom {
    Page<Restaurant> filterByCriteria(String name, String tag, String city, Boolean vegetarian, Boolean vegan,
                                      Double averageRating, Integer totalReviewsCount,
                                      Double latitude, Double longitude, Pageable pageable);
}
