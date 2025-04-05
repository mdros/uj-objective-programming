package com.mdros.exercise3.controller

import com.mdros.exercise3.dto.LoginBody
import com.mdros.exercise3.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy
import org.springframework.web.bind.annotation.*

@RestController
@Lazy
class LazyAuthController {

    @Autowired
    private lateinit var authService: AuthService

//    @PostMapping("/login")
//    fun login(@RequestBody body: LoginBody): String {
//        return if (authService.isAuthorized(body.username, body.password)) {
//            "Access granted"
//        } else {
//            "Access denied"
//        }
//    }
}
