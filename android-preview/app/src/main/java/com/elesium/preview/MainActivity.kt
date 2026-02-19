package com.elesium.preview

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webview)
        
        // Enable JavaScript for React
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        
        // Keep links inside the WebView
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                view.loadUrl(url)
                return true
            }
        }

        // Load the local Vite dev server
        // 10.0.2.2 is the special alias to your host machine's localhost from the Android emulator
        webView.loadUrl("http://10.0.2.2:5173")
    }
}
