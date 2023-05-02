"""This is a helper class for decoding and verifying JWT tokens passed back from the clients to the server"""
import jwt
from jwt import InvalidSignatureError, ExpiredSignatureError

from django.conf import settings


def decode_jwt(request, is_direct=False) -> str:
    if is_direct:
        token = request
    else:
        token = request.GET.get('jwt')
    if is_valid_uuid(request, is_direct):
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.SIMPLE_JWT["ALGORITHM"])
        return decode['user_id']
    else:
        return '0'


def is_valid_uuid(request, is_direct) -> bool:
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
