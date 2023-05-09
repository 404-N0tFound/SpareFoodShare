from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    """Generates a hash of the user uuid for activation via the six library. This hash is then included in the
    verification link generated and sent to the new user's email."""
    def _make_hash_value(self, user, timestamp) -> str:
        return (
                six.text_type(user['email']) + six.text_type(timestamp)
        )


account_activation_token = AccountActivationTokenGenerator()
