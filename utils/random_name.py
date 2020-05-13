import random
import string


class RandomName(object):
    source = list(string.ascii_letters)
    name_length = 18
    for index in range(1,10):
        source.append(index)

    def get_random_name(cls):
        return ''.join(random.sample(cls.source, cls.name_length))
