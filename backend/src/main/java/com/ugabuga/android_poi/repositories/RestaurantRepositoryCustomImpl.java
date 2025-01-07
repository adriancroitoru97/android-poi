package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.Restaurant;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RestaurantRepositoryCustomImpl implements RestaurantRepositoryCustom {

    private final EntityManager entityManager;
    private final Integer SEARCH_RADIUS = 100_000; // 100 km in meters

    @Override
    public Page<Restaurant> filterByCriteria(String name, String tag, String city, Boolean vegetarian, Boolean vegan,
                                                Double averageRating, Integer totalReviewsCount,
                                                Double latitude, Double longitude, Pageable pageable) {
        StringBuilder sql = new StringBuilder(
                "SELECT r.id, r.restaurant_link, r.name, r.country, r.region, r.province, r.city, " +
                        "r.address, r.latitude, r.longitude, r.vegetarian, r.vegan, r.open_hours, " +
                        "r.average_rating, r.total_reviews_count " +
                        "FROM restaurant r "
        );

        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM restaurant r ");

        // Join restaurant_to_tags table if the tag filter is provided
        if (tag != null) {
            sql.append("JOIN restaurant_to_tags rt ON r.id = rt.restaurant_id ");
            sql.append("JOIN tag t ON rt.tag_id = t.id ");
            countSql.append("JOIN restaurant_to_tags rt ON r.id = rt.restaurant_id ");
            countSql.append("JOIN tag t ON rt.tag_id = t.id ");
        }

        // Add filtering conditions
        StringBuilder whereClause = new StringBuilder("WHERE 1=1 ");
        if (name != null) {
            whereClause.append("AND LOWER(r.name) LIKE :name ");
        }
        if (city != null) {
            whereClause.append("AND LOWER(r.city) = :city ");
        }
        if (vegetarian != null) {
            whereClause.append("AND r.vegetarian = :vegetarian ");
        }
        if (vegan != null) {
            whereClause.append("AND r.vegan = :vegan ");
        }
        if (tag != null) {
            whereClause.append("AND t.name = :tag ");
        }
        if (averageRating != null) {
            whereClause.append("AND r.average_rating IS NOT NULL ");
            whereClause.append("AND r.average_rating >= :averageRating ");
        }
        if (totalReviewsCount != null) {
            whereClause.append("AND r.total_reviews_count >= :totalReviewsCount ");
        }
        if (latitude != null && longitude != null) {
            // Add geospatial filtering for circular area
            whereClause.append(
                    "AND ST_DistanceSphere(ST_MakePoint(r.longitude, r.latitude), ST_MakePoint(:longitude, :latitude)) <= :radius "
            );
        }

        // Add the WHERE clause to both queries
        sql.append(whereClause);
        countSql.append(whereClause);

        // Add pagination to the main query
        sql.append("LIMIT :limit OFFSET :offset");

        // Create the main query
        Query query = entityManager.createNativeQuery(sql.toString(), Restaurant.class);
        if (name != null) query.setParameter("name", "%" + name.toLowerCase() + "%");
        if (city != null) query.setParameter("city", city.toLowerCase());
        if (vegetarian != null) query.setParameter("vegetarian", vegetarian);
        if (vegan != null) query.setParameter("vegan", vegan);
        if (tag != null) query.setParameter("tag", tag);
        if (averageRating != null) query.setParameter("averageRating", averageRating);
        if (totalReviewsCount != null) query.setParameter("totalReviewsCount", totalReviewsCount);

        if (latitude != null && longitude != null) {
            query.setParameter("latitude", latitude);
            query.setParameter("longitude", longitude);
            query.setParameter("radius", SEARCH_RADIUS);
        }

        query.setParameter("limit", pageable.getPageSize());
        query.setParameter("offset", pageable.getOffset());

        // Execute the main query
        List<Restaurant> restaurants = query.getResultList();

        // Create the count query
        Query countQuery = entityManager.createNativeQuery(countSql.toString());
        if (name != null) countQuery.setParameter("name", "%" + name.toLowerCase() + "%");
        if (city != null) countQuery.setParameter("city", city.toLowerCase());
        if (vegetarian != null) countQuery.setParameter("vegetarian", vegetarian);
        if (vegan != null) countQuery.setParameter("vegan", vegan);
        if (tag != null) countQuery.setParameter("tag", tag);
        if (averageRating != null) countQuery.setParameter("averageRating", averageRating);
        if (totalReviewsCount != null) countQuery.setParameter("totalReviewsCount", totalReviewsCount);

        if (latitude != null && longitude != null) {
            countQuery.setParameter("latitude", latitude);
            countQuery.setParameter("longitude", longitude);
            countQuery.setParameter("radius", 100_000); // 100 km in meters
        }

        // Get total count for pagination metadata
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        // Return the paginated result
        return new PageImpl<>(restaurants, pageable, total);
    }

}
