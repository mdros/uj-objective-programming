package com.example.exercise_9.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.exercise_9.R
import com.example.exercise_9.ui.adapter.CategoryAdapter
import com.example.exercise_9.ui.model.Category

class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_home, container, false)
        val recyclerView = root.findViewById<RecyclerView>(R.id.categoryRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(context)

        val categories = listOf(
            Category(1, "Electronics"),
            Category(2, "Books"),
            Category(3, "Clothing"),
            Category(4, "Toys")
        )

        recyclerView.adapter = CategoryAdapter(categories)
        return root
    }
}