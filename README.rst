m-response
==========

Set up local environment
------------------------

To set up the project VM you’ll need `docker` and `docker-compose` . You can
start it up using the following commands.

.. code:: sh

   docker-compose build

Create database and administrator user
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sh

   docker-compose run web bash
   ./manage.py migrate
   ./manage.py createcachetable
   ./manage.py createsuperuser

Start the server
~~~~~~~~~~~~~~~~

.. code:: sh

  docker-compose up

Then you can visit administration panel at http://localhost:8000/admin/.

And the main UI through http://localhost:8000/

The application uses external authentication. To log-in locally please do it
through the administration interface instead.

Testing the prod image
~~~~~~~~~~~~~~~~~~~~~~

To test building and running the prod image run the following:

.. code:: sh

   docker-compose -f docker-compose.prod.yml up --build

Data Retrieval from the Google Playstore
~~~~~~~~~~~~~~~~~~~

To retrieve (download) reviews and publish (upload) responses on the Google Playstore, there is a small service.
This service lives in its own repo: https://github.com/mozilla/m-response-api

Committing changes
------------------

Set up `pre-commit <https://pre-commit.com/>`_ to automatically run flake8, black and other linters against your commmit:

.. code:: sh

   pip install pre-commit
   pre-commit install
