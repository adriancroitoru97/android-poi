package com.ugabuga.android_poi.services;

import com.ugabuga.android_poi.models.*;
import com.ugabuga.android_poi.repositories.IUserRepository;
import com.ugabuga.android_poi.repositories.RestaurantRepository;
import com.ugabuga.android_poi.services.impl.PreferencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    @Autowired
    private final RestaurantRepository restaurantRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PreferencesService preferencesService;

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
                                              Double latitude, Double longitude, Double radius, Pageable pageable) {
        return restaurantRepository.filterByCriteria(name, tag, city, vegetarian, vegan, averageRating, totalReviewsCount,
                latitude, longitude, radius, pageable);
    }

    public Page<Restaurant> filterRestaurantsWithScores(User user, String name, String tag, String city,
                                                        Boolean vegetarian, Boolean vegan, Double averageRating,
                                                        Integer totalReviewsCount, Double latitude, Double longitude,
                                                        Double radius, Pageable pageable) {
        // Fetch restaurants using the existing filterRestaurants method
        Page<Restaurant> restaurants = filterRestaurants(
                name, tag, city, vegetarian, vegan, averageRating,
                totalReviewsCount, latitude, longitude, radius, pageable
        );

        // Map user preferences to a count
        Map<String, Long> preferenceCounts = user.getListOfPreference()
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getPreferenceType().name(),
                        Preference::getCount
                ));

        // Add recommendation scores to restaurants
        List<Restaurant> scoredRestaurants = restaurants.stream().peek(restaurant -> {
                    double score = 0;

                    // Calculate preference score
                    if (restaurant.getTags() != null) {
                        for (Tag resTag : restaurant.getTags()) {
                            score += preferenceCounts.getOrDefault(resTag.getName().name(), 0L) * 2;
                        }
                    }

                    // Add rating score
                    score += (restaurant.getAverageRating() != null ? restaurant.getAverageRating() : 0) * 2;

                    restaurant.setRecommendationScore(score);
                }).sorted(Comparator.comparingDouble(Restaurant::getRecommendationScore).reversed())
                .collect(Collectors.toList());

        return new PageImpl<>(scoredRestaurants, pageable, restaurants.getTotalElements());
    }

    public String addLikeToRestaurant(Integer userId, Long restaurantId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilizatorul cu id-ul " + userId + " nu a fost gasit!"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() -> new RuntimeException("Restaurantul cu id-ul " + restaurantId + " nu a fost gasit!"));

        List<Restaurant> userLikedRestaurants = user.getLikedRestaurants();

        for (Restaurant r : userLikedRestaurants) {
            if (r.getId().equals(restaurant.getId())) {
                return "Ai mai dat o data like acestui restaurant!";
            }
        }

        restaurant.setUsersLikes(restaurant.getUsersLikes() + 1);
        user.getLikedRestaurants().add(restaurant);

        restaurantRepository.saveAndFlush(restaurant);
        userRepository.saveAndFlush(user);

        preferencesService.increasePreferenceCountForUser(userId, restaurantId);

        return "Restaurantul cu id-ul " + restaurantId + " va multumeste!";

    }

    public String removeLikeFromRestaurant(Integer userId, Long restaurantId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilizatorul cu id-ul " + userId + " nu a fost gasit!"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() -> new RuntimeException("Restaurantul cu id-ul " + restaurantId + " nu a fost gasit!"));

        List<Restaurant> userLikedRestaurants = user.getLikedRestaurants();

        for (Restaurant r : userLikedRestaurants) {
            if (r.getId().equals(restaurant.getId())) {
                userLikedRestaurants.remove(r);
                restaurant.setUsersLikes(restaurant.getUsersLikes() - 1);

                userRepository.saveAndFlush(user);
                restaurantRepository.saveAndFlush(restaurant);

                return "Ne pare rau sa auzim ca restaurantul  " + restaurant.getName() + " nu v-a multumit :(";
            }
        }

        return "Trebuie sa dati mai intai like pentru a putea da dislike!";

    }
}
