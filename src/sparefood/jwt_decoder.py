"""This is a helper class for decoding and verifying JWT tokens passed back from the clients to the server"""
import jwt
from jwt import InvalidSignatureError, ExpiredSignatureError

from django.conf import settings


def decode_jwt(request, is_direct=False) -> str:
    """Decodes a JWT token and validates that it was signed with the correct signature
    :param request: The request object itself including the data headers
    :param is_direct: Whether to use the request or true if the jwt as a string itself is being passed
    :return: The user UUID as a string
    """
    if is_direct:
        token = request
    else:
        token = request.GET.get('jwt')
    if is_valid_uuid(request, is_direct):
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.SIMPLE_JWT["ALGORITHM"])
        return decode['user_id']
    else:
        return '0'


def is_valid_uuid(request, is_direct=False) -> bool:
    """Validates a JWT token that it was signed with the correct signature
    :param request: The request object itself including the data headers
    :param is_direct: Whether to use the request or true if the jwt as a string itself is being passed
    :return: A bool if it is a valid token or not
    """
    if is_direct:
        token = request
    else:
        token = request.GET.get('jwt')
    if token is not None:
        try:
            jwt.decode(token, settings.SECRET_KEY, algorithms=settings.SIMPLE_JWT["ALGORITHM"])
        except InvalidSignatureError:
            return False
        except ExpiredSignatureError:
            return False
        except jwt.exceptions.DecodeError:
            return False
    return True


def is_admin(request, is_direct=False):
    """Decodes a JWT token and validates that it was signed with the correct signature
    :param request: The request object itself including the data headers
    :param is_direct: Whether to use the request or true if the jwt as a string itself is being passed
    :return: A bool if the user is an admin or not
    """
    if is_direct:
        token = request
    else:
        token = request.GET.get('jwt')
    if is_valid_uuid(request, is_direct):
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.SIMPLE_JWT["ALGORITHM"])
        return decode['is_admin']
    else:
        return False
