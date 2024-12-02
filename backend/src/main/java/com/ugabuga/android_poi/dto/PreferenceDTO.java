package com.ugabuga.android_poi.dto;

import com.ugabuga.android_poi.models.PreferenceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PreferenceDTO {

    private PreferenceType preferenceType;

    private Long count;
}
