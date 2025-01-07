package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, RestaurantRepositoryCustom {
    @Query("SELECT r FROM Restaurant r JOIN r.tags t WHERE t.name = :tag")
    Page<Restaurant> findRestaurantsByTag(@Param("tag") PreferenceType tag, Pageable pageable);

}
