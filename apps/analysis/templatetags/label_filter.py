from django import template
register = template.Library()


@register.filter
def label_split(labels):
    # print(labels)
    tags = labels.split("?")
    return "\n".join(tags)
    # return labels