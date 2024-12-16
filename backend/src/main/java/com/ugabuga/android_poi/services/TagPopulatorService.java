package com.ugabuga.android_poi.services;

import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.Tag;
import com.ugabuga.android_poi.repositories.TagRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TagPopulatorService {

    @Autowired
    private TagRepository tagRepository;

    public void populateTags() {
        if (tagRepository.count() != 0) {
            System.out.println("Tags have already been populated in the database.");
            return;
        }

        for (PreferenceType preferenceType : PreferenceType.values()) {
            // Check if the tag already exists in the database
            Tag tag = new Tag();
            tag.setName(preferenceType);
            tagRepository.save(tag);
        }
        System.out.println("Tags have been populated in the database.");
    }
}
