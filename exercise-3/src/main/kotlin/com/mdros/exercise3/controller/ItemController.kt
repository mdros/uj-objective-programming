package com.mdros.exercise3.controller

import com.mdros.exercise3.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

data class Item(
    val id: Int,
    val name: String,
    val description: String
)

data class ItemRequest(
    val username: String,
    val password: String
)

@RestController
@RequestMapping("/items")
class ItemController {

    @Autowired
    private lateinit var authService: AuthService

    private val mockItems = listOf(
        Item(1, "Item One", "This is the first item"),
        Item(2, "Item Two", "This is the second item"),
        Item(3, "Item Three", "This is the third item")
    )

    @PostMapping
    fun getItems(@RequestBody request: ItemRequest): Any {
        return if (authService.isAuthorized(request.username, request.password)) {
            mapOf("items" to mockItems)
        } else {
            mapOf("error" to "Unauthorized access")
        }
    }
}