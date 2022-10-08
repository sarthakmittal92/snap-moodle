'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1']
DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

SECRET_KEY = '-05sgp9!deq=q1nltm@^^2cc+v29i(tyybv3v2t77qi66czazj'

ROOT_URLCONF = 'home.urls'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'HOST': '127.0.0.1',
        'PORT': '8000',
        'USER': 'noob',
        'PASSWORD': 'noobmaster'
    }
}

CORS_ORIGIN_WHITELIST = (
    'localhost:3000',
)
