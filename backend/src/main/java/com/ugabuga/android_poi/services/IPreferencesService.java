package com.ugabuga.android_poi.services;

import com.ugabuga.android_poi.dto.ListOfPreferencesDTO;
import com.ugabuga.android_poi.dto.PreferenceDTO;
import com.ugabuga.android_poi.models.PreferenceType;

import java.util.List;

public interface IPreferencesService {
    public List<String> getPreferenceTypes();

    String addPreferencesForUser(Integer userId, List<String> listOfPreferences);

    List<PreferenceDTO> getPreferencesByUserId(Integer userId);

    String increasePreferenceCountForUser(Integer userId, Long restaurantId);
}
