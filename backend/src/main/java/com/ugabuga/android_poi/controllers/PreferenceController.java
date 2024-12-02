package com.ugabuga.android_poi.controllers;

import com.ugabuga.android_poi.dto.ListOfPreferencesDTO;
import com.ugabuga.android_poi.dto.PreferenceDTO;
import com.ugabuga.android_poi.services.impl.PreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/preference")
public class PreferenceController {

    @Autowired
    private PreferencesService preferencesService;

    @GetMapping("/getAllPreferences")
    public ResponseEntity<List<String>> getAllPreferences() {
        return ResponseEntity.ok(preferencesService.getPreferenceTypes());
    }

    @GetMapping("/getPreferencesByUserId")
    public ResponseEntity<List<PreferenceDTO>> getPreferencesByUserId(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(preferencesService.getPreferencesByUserId(userId));
    }


    @PostMapping("/addPreferenceForUser")
    public ResponseEntity<String> addPreferencesForUser(@RequestParam(name = "userId") Integer userId,
                                                        @RequestBody ListOfPreferencesDTO listOfPreferences) {
        return ResponseEntity.ok(preferencesService.addPreferencesForUser(userId, listOfPreferences.getListOfPreferences()));

    }
}
