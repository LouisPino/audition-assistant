from django import template
import calendar
register = template.Library()


def month_name(month_number):
    return calendar.month_name[int(month_number)]

register.filter('month_name', month_name)