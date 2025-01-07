package com.ugabuga.android_poi.services.impl;

import com.ugabuga.android_poi.dto.PreferenceDTO;
import com.ugabuga.android_poi.models.*;
import com.ugabuga.android_poi.repositories.IPreferenceRepository;
import com.ugabuga.android_poi.repositories.IUserRepository;
import com.ugabuga.android_poi.repositories.RestaurantRepository;
import com.ugabuga.android_poi.services.IPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PreferencesService implements IPreferencesService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IPreferenceRepository preferenceRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public List<String> getPreferenceTypes() {
        List<String> listOfPreferenceTypes = new ArrayList<>();
        for (PreferenceType preferenceType : PreferenceType.values()) {
            listOfPreferenceTypes.add(preferenceType.toString());
        }
        return listOfPreferenceTypes;
    }

    @Override
    public String addPreferencesForUser(Integer userId, List<String> listOfPreferences) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilizatorul cu id-ul " + userId + " nu a fost gasit!"));
        List<Preference> userPreferences = user.getListOfPreference();

        List<Preference> preferencesToRemove = new ArrayList<>();
        for (Preference preference : userPreferences) {
            if (!listOfPreferences.contains(preference.getPreferenceType().toString())) {
                preferencesToRemove.add(preference);
            }
        }

        // Remove preferences outside the loop
        for (Preference preference : preferencesToRemove) {
            userPreferences.remove(preference);
            preferenceRepository.deleteById(preference.getId());
        }


        try {
            for (String preference : listOfPreferences) {
                PreferenceType preferenceType = PreferenceType.valueOf(preference);
                Optional<Preference> preferenceOptional = userPreferences.stream().filter(p -> p.getPreferenceType().equals(preferenceType)).findFirst();

                if (preferenceOptional.isEmpty()) {
                    Preference preferenceToAdd = new Preference();

                    preferenceToAdd.setPreferenceType(preferenceType);
                    preferenceToAdd.setCount(1L);
                    preferenceRepository.saveAndFlush(preferenceToAdd);
                    userPreferences.add(preferenceToAdd);
                }
            }


            userRepository.saveAndFlush(user);

            return "Preferences added for user!";

        } catch (RuntimeException e) {
            return e.getMessage();
        }

    }

    @Override
    public List<PreferenceDTO> getPreferencesByUserId(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilizatorul cu id-ul " + userId + " nu a fost gasit!"));
        try {
            List<PreferenceDTO> preferenceDTOList = new ArrayList<>();

            for (Preference preference : user.getListOfPreference()) {
                PreferenceDTO preferenceDTO = new PreferenceDTO();
                preferenceDTO.setPreferenceType(preference.getPreferenceType());
                preferenceDTO.setCount(preference.getCount());

                preferenceDTOList.add(preferenceDTO);
            }

            return preferenceDTOList;
        } catch (RuntimeException e) {
            throw new RuntimeException(e.getMessage());
        }

    }

    @Override
    public String increasePreferenceCountForUser(Integer userId, Long restaurantId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilizatorul cu id-ul " + userId + " nu a fost gasit!"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() -> new RuntimeException("Utilizatorul cu id-ul " + restaurantId + " nu a fost gasit!"));
        try {
            List<Preference> userPreferences = user.getListOfPreference();
            Set<Tag> restaurantTags = restaurant.getTags();

            for (Tag tag : restaurantTags) {
                boolean isNewPref = true;
                for (Preference preference : userPreferences) {
                    if (preference.getPreferenceType().equals(tag.getName())) {
                        preference.setCount(preference.getCount() + 1);
                        isNewPref = false;
                        break;
                    }
                }

                if (isNewPref) {
                    Preference preferenceToAdd = new Preference();
                    preferenceToAdd.setPreferenceType(tag.getName());
                    preferenceToAdd.setCount(1L);
                    preferenceRepository.saveAndFlush(preferenceToAdd);
                    userPreferences.add(preferenceToAdd);
                }
            }

            userRepository.saveAndFlush(user);
            return "Preferences increased for user: " + user.getEmail() + " !";
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }
}
