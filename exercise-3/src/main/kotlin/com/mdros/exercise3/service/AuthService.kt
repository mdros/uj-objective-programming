package com.mdros.exercise3.service

import org.springframework.stereotype.Service

@Service
class AuthService {

    private val validUsername = "admin"
    private val validPassword = "password123"

    fun isAuthorized(username: String, password: String): Boolean {
        return username == validUsername && password == validPassword
    }
}
