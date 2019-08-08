from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField()

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Response(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    text = models.TextField()
