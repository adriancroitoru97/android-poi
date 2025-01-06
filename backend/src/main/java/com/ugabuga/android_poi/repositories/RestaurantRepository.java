package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
