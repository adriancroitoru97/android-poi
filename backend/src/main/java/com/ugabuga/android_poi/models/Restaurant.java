package com.ugabuga.android_poi.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "restaurant")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant_link", nullable = false)
    private String restaurantLink;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "region")
    private String region;

    @Column(name = "province")
    private String province;

    @Column(name = "city")
    private String city;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @ElementCollection
    @CollectionTable(name = "restaurant_tags", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "tag")
    @Enumerated(EnumType.STRING)
    private List<PreferenceType> tags;

    @Column(name = "vegetarian", nullable = false)
    private Boolean vegetarian;

    @Column(name = "vegan", nullable = false)
    private Boolean vegan;

    @Column(name = "open_hours")
    private String openHours;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "total_reviews_count")
    private Integer totalReviewsCount;

}
