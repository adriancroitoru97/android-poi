package com.ugabuga.android_poi.services.impl;

import com.ugabuga.android_poi.dto.PreferenceDTO;
import com.ugabuga.android_poi.models.Preference;
import com.ugabuga.android_poi.models.PreferenceType;
import com.ugabuga.android_poi.models.User;
import com.ugabuga.android_poi.repositories.IPreferenceRepository;
import com.ugabuga.android_poi.repositories.IUserRepository;
import com.ugabuga.android_poi.services.IPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PreferencesService implements IPreferencesService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IPreferenceRepository preferenceRepository;

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

        try {
            for (String preference : listOfPreferences) {
                PreferenceType preferenceType = PreferenceType.valueOf(preference);
                Preference preferenceToAdd = new Preference();

                preferenceToAdd.setPreferenceType(preferenceType);
                preferenceToAdd.setCount(1L);
                preferenceRepository.saveAndFlush(preferenceToAdd);
                user.getListOfPreference().add(preferenceToAdd);
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
}
