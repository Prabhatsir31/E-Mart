package com.cartmate.service;

import com.cartmate.config.JwtUtil;
import com.cartmate.dto.AuthResponseDto;
import com.cartmate.dto.LoginRequestDto;
import com.cartmate.dto.UserRegistrationDto;
import com.cartmate.entity.User;
import com.cartmate.repository.UserRepository;
import com.cartmate.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponseDto register(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordhash(passwordEncoder.encode(dto.getPassword()));
        user.setAddress(dto.getAddress());
        user.setPhonenumber(dto.getPhonenumber());
        user.setIs_cardholder(dto.isCardholder());
        user.setLoyalitypointbalance(0);
        user.setRegistrationdate(new Date());

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getUserid(), saved.getUsername());
        return new AuthResponseDto(token, saved.getUserid(), saved.getEmail(), saved.getUsername());
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
            authenticationManager.authenticate(authToken);
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserid(), user.getUsername());
        return new AuthResponseDto(token, user.getUserid(), user.getEmail(), user.getUsername());
    }
}