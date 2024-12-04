package com.ugabuga.android_poi.repositories;

import com.ugabuga.android_poi.models.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPreferenceRepository extends JpaRepository<Preference, Long> {
}
