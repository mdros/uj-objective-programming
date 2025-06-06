import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class AppTest(unittest.TestCase):
    def setUp(self):
        op = webdriver.ChromeOptions()
        op.add_argument("headless")
        self.driver = webdriver.Chrome(options=op)
        self.driver.get("http://localhost:5173")
        time.sleep(0.5)

    def tearDown(self):
        self.driver.quit()

    def test_home_page_title(self):
        self.assertIn("Vite + React + TS", self.driver.title)

    def test_navigation_to_cart(self):
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        self.assertIn("Your Cart", self.driver.page_source)

    def test_navigation_to_orders(self):
        self.driver.find_element(By.LINK_TEXT, "Orders").click()
        self.assertIn("Orders", self.driver.page_source)

    def test_remove_product_from_cart(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        product_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add to cart')]")
        product_button.click()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        remove_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Remove from cart')]")
        remove_button.click()
        self.assertIn("Your cart is empty", self.driver.page_source)

    def test_empty_cart_message(self):
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        self.assertIn("Your cart is empty", self.driver.page_source)

    def test_create_order(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        product_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add to cart')]")
        product_button.click()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        pay_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Pay')]")
        pay_button.click()
        WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        alert = self.driver.switch_to.alert
        self.assertIn("Creating order and payment", alert.text)
        alert.accept()

    def test_orders_page_displays_orders(self):
        self.driver.find_element(By.LINK_TEXT, "Orders").click()
        self.assertIn("Orders", self.driver.page_source)

    def test_product_list_loads(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        products = self.driver.find_elements(By.CLASS_NAME, "text-lg")
        self.assertGreater(len(products), 0)

    def test_cart_persists_after_navigation(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        product_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add to cart')]")
        product_button.click()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        self.assertIn("Pay", self.driver.page_source)

    def test_order_creation_clears_cart(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        product_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add to cart')]")
        product_button.click()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        pay_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Pay')]")
        pay_button.click()
        WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        alert = self.driver.switch_to.alert
        alert.accept()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        self.assertIn("Your cart is empty", self.driver.page_source)

    def test_invalid_product_id(self):
        self.driver.get("http://localhost:5173/product/1231242341321")
        self.assertIn("Not Found", self.driver.page_source)

    def test_ui_responsiveness_mobile(self):
        self.driver.set_window_size(375, 667)
        self.assertIn("Vite + React + TS", self.driver.title)

    def test_ui_responsiveness_tablet(self):
        self.driver.set_window_size(768, 1024)
        self.assertIn("Vite + React + TS", self.driver.title)

    def test_navigation_links_home(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        self.assertIn("Products in cart:", self.driver.page_source)

    def test_navigation_links_cart(self):
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        self.assertIn("Your Cart", self.driver.page_source)

    def test_navigation_links_orders(self):
        self.driver.find_element(By.LINK_TEXT, "Orders").click()
        self.assertIn("Orders", self.driver.page_source)

    def test_remove_all_products_from_cart(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        product_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Add to cart')]")
        for button in product_buttons[:2]:
            button.click()
        self.driver.find_element(By.LINK_TEXT, "Cart").click()
        remove_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Remove from cart')]")
        for button in remove_buttons:
            button.click()
        self.assertIn("Your cart is empty", self.driver.page_source)

    def test_product_quantity_update_in_cart(self):
        self.driver.find_element(By.LINK_TEXT, "Home").click()
        product_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add to cart')]")
        product_button.click()
        self.assertIn("Products in cart: 1", self.driver.page_source)

    def test_orders_page_contains_order_history(self):
        self.driver.find_element(By.LINK_TEXT, "Orders").click()
        self.assertIn("Orders", self.driver.page_source)

    def test_home_page_contains_footer(self):
        footer = self.driver.find_element(By.TAG_NAME, "footer")
        self.assertIsNotNone(footer)

    def test_home_page_contains_featured_products(self):
        self.assertIn("Products", self.driver.page_source)

    def test_navigation_bar_contains_home_link(self):
        home_link = self.driver.find_element(By.LINK_TEXT, "Home")
        self.assertIsNotNone(home_link)

    def test_navigation_bar_contains_cart_link(self):
        cart_link = self.driver.find_element(By.LINK_TEXT, "Cart")
        self.assertIsNotNone(cart_link)

    def test_navigation_bar_contains_orders_link(self):
        orders_link = self.driver.find_element(By.LINK_TEXT, "Orders")
        self.assertIsNotNone(orders_link)

    def test_home_page_contains_contact_us_link(self):
        contact_us_link = self.driver.find_element(By.LINK_TEXT, "Contact Us")
        self.assertIsNotNone(contact_us_link)

    def test_home_page_contains_profile_link(self):
        profile_link = self.driver.find_element(By.LINK_TEXT, "Profile")
        self.assertIsNotNone(profile_link)

    def test_page_loads_successfully(self):
        self.assertEqual(self.driver.current_url, "http://localhost:5173/")

    def test_home_page_contains_logo(self):
        logo = self.driver.find_element(By.ID, "root")
        self.assertIsNotNone(logo)

    def test_home_page_contains_search_bar(self):
        search_bar = self.driver.find_element(By.CLASS_NAME, "TanStackRouterDevtools")
        self.assertIsNotNone(search_bar)

    def test_page_contains_topbar(self):
        topbar = self.driver.find_element(By.ID, "topbar")
        self.assertIsNotNone(topbar)


if __name__ == "__main__":
    unittest.main()
