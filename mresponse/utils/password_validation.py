from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class OneLetterOneNumberPasswordValidator:
    """
    Validate whether the password has at least one letter and one number.
    """
    def validate(self, password, user=None):
        has_letter = False
        has_number = False

        for char in password:
            if char.isalpha():
                has_letter = True

            if char.isdigit():
                has_number = True

        if not has_letter:
            raise ValidationError(
                _("This password does not contain a letter."),
                code='password_no_letter',
            )

        if not has_number:
            raise ValidationError(
                _("This password does not contain a number."),
                code='password_no_number',
            )

    def get_help_text(self):
        return _("Your password must contain at least one letter and at least one number.")
