package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(PreferenceType name);
}
