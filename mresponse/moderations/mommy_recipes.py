from model_mommy.recipe import Recipe
from mresponse.moderations.models import Moderation

ModerationRecipe = Recipe(
    Moderation,
    positive_in_tone=False,
    addressing_the_issue=False,
    personal=False,

)
