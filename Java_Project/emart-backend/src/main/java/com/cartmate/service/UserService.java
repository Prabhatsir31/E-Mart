package com.cartmate.service;

import com.cartmate.dto.AuthResponseDto;
import com.cartmate.dto.LoginRequestDto;
import com.cartmate.dto.UserRegistrationDto;

public interface UserService {
    AuthResponseDto register(UserRegistrationDto dto);
    AuthResponseDto login(LoginRequestDto dto);
}


