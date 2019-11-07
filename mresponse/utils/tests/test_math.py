from django.test import TestCase

from mresponse.utils.math import change_calculation


class TestChangeCalculation(TestCase):
    def test_value_1_is_zero(self):
        self.assertEqual(change_calculation(0, 10), None)

    def test_value_1_is_less_than_value_2(self):
        self.assertEqual(change_calculation(1, 10), 9.0)

    def test_value_1_is_greater_than_value_2(self):
        self.assertEqual(change_calculation(10, 1), -0.9)
