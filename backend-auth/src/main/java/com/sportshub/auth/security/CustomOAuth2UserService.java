package com.sportshub.auth.security;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        Map<String, Object> attributes = new HashMap<>();
        if ("google".equals(registrationId)) {
            // Google: flat attributes
            attributes.put("provider", "google");
            attributes.put("providerId", oAuth2User.getAttribute("sub"));
            attributes.put("email", oAuth2User.getAttribute("email"));
            attributes.put("name", oAuth2User.getAttribute("name"));
        } else if ("naver".equals(registrationId)) {
            // Naver: nested under 'response'
            Map<String, Object> response = oAuth2User.getAttribute("response");
            if (response != null) {
                attributes.put("provider", "naver");
                attributes.put("providerId", (String) response.get("id"));
                attributes.put("email", (String) response.get("email"));
                attributes.put("name", (String) response.get("name"));
            }
        } else {
            attributes.putAll(oAuth2User.getAttributes());
        }

        // Use 'email' as the name attribute if available, fallback to providerId
        String nameAttributeKey = attributes.getOrDefault("email", attributes.getOrDefault("providerId", "name")).toString();
        return new DefaultOAuth2User(oAuth2User.getAuthorities(), attributes, nameAttributeKey);
    }
}

