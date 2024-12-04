package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.Preference;
import com.ugabuga.android_poi.models.PreferenceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPreferenceRepository extends JpaRepository<Preference, Long> {
    Optional<Preference> findByPreferenceType(PreferenceType preferenceType);
}
